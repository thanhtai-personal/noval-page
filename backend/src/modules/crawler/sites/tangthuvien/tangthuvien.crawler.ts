import { Injectable, Logger } from '@nestjs/common';
import { ICrawlerAdapter } from '../interfaces/crawler-adapter.interface';
import { slugify } from '@/utils/slugify';
import { Source } from '@/schemas/source.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Story } from '@/schemas/story.schema';
import { Author } from '@/schemas/author.schema';
import { Chapter } from '@/schemas/chapter.schema';
import { Category } from '@/schemas/category.schema';
import { Tag } from '@/schemas/tag.schema';
import { CrawlerGateway } from '../../crawler.gateway';
import puppeteer from 'puppeteer';
import { CrawlHistory } from '@/schemas/crawlHistory.schema';
import { sleep } from '@/utils/functions';

import * as fs from 'fs';
import * as path from 'path';
import { getLimitConfig } from '@/utils/constants';
import { DBNames, switchModelByDBLimit } from "@/utils/database";
import { ChapterContent } from "@/schemas/chapterContent.schema";

const ttvSearchPath = 'https://truyen.tangthuvien.vn/tong-hop?rank=vw&page=';

@Injectable()
export class TangthuvienCrawler implements ICrawlerAdapter {
  private source: any;
  private readonly logger = new Logger(TangthuvienCrawler.name);

  constructor(
    private readonly gateway: CrawlerGateway,

    @InjectModel(Source.name, DBNames.story1) private sourceModel: Model<Source>,
    @InjectModel(Author.name, DBNames.story1) private authorModel: Model<Author>,
    @InjectModel(Category.name, DBNames.story1) private categoryModel: Model<Category>,
    @InjectModel(CrawlHistory.name, DBNames.story1) private crawlHistoryModel: Model<Tag>,
    @InjectModel(Story.name, DBNames.story1) private storyModel: Model<Story>,

    //sub db to store chapter
    @InjectModel(Chapter.name, DBNames.story1) private chapter1Model: Model<Chapter>,
    @InjectModel(Chapter.name, DBNames.story2) private chapter2Model: Model<Chapter>,
    @InjectModel(Chapter.name, DBNames.story3) private chapter3Model: Model<Chapter>,
    @InjectModel(Chapter.name, DBNames.story4) private chapter4Model: Model<Chapter>,
    @InjectModel(Chapter.name, DBNames.story5) private chapter5Model: Model<Chapter>,

    //sub db to store chapter content
    @InjectModel(ChapterContent.name, DBNames.story2) private chapterContent2Model: Model<ChapterContent>,
    @InjectModel(ChapterContent.name, DBNames.story3) private chapterContent3Model: Model<ChapterContent>,
    @InjectModel(ChapterContent.name, DBNames.story4) private chapterContent4Model: Model<ChapterContent>,
    @InjectModel(ChapterContent.name, DBNames.story5) private chapterContent5Model: Model<ChapterContent>,
  ) {
    this.getSource();
  }

  async getAllStoryOverview() {
    await this.getSource();

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
      const currentStories = await this.storyModel.find({});
      this.logData(
        `>> Found ${currentStories.length} stories in the database.`,
      );

      if (
        currentStories.length >= getLimitConfig().DEMO_STORIES_NUMBER &&
        getLimitConfig().ON
      ) {
        // Nếu đang ở chế độ demo, chỉ lấy một số lượng stories nhất định
        this.logData(
          `>> DEMO MODE: Skipping story overview crawl. Found ${currentStories.length} stories.`,
        );
        return;
      }

      // Lấy record được tạo ra cuối cùng từ crawlHistoryModel
      const lastCrawlRecord: any = (await this.crawlHistoryModel
        .findOne({ source: this.source._id })
        .sort({ createdAt: -1 })) || {
        source: this.source._id,
        totalPage: 0,
        currentPage: 1,
      };

      await page.goto(ttvSearchPath);

      const searchValue = await page.$$('ul.pagination li a');
      const lastPageUrl = await (
        await searchValue[searchValue.length - 2].getProperty('href')
      ).jsonValue();
      const totalPage =
        lastCrawlRecord.totalPage ||
        parseInt(
          new URLSearchParams(new URL(lastPageUrl as any).search).get('page') ||
          '1',
        );
      this.logData(
        `>> Total pages to crawl: ${totalPage} (Current page: ${lastCrawlRecord.currentPage})`,
      );

      for (let p = lastCrawlRecord.currentPage; p <= totalPage; p++) {
        if (getLimitConfig().ON && p > getLimitConfig().DEMO_CRAWL_PAGES) {
          this.logData(`>> DEMO MODE: Stopping at page ${p}`);
          break;
        }

        this.logData(`>>LOAD PAGE ${p} - ${new Date().toISOString()}`);
        await page.goto(`${ttvSearchPath}${p}`);

        const novalsInfoNodes = await page.$$('div.book-img-text ul li');
        for (const novalInfoJSNode of novalsInfoNodes) {
          let title, url, category, totalChapters;

          try {
            title = await novalInfoJSNode.$eval(
              'h4 a',
              (e) => e.textContent || 'no-title',
            );
            this.logData(`Processing story: ${title}`);

            url = await novalInfoJSNode.$eval(
              'h4 a',
              (e) => e.getAttribute('href') || '',
            );
            this.logData(`URL: ${url}`);

            category = await novalInfoJSNode.$eval(
              'div.book-mid-info p.author a[href*="/the-loai/"]',
              (e) => e.textContent || 'no-category',
            );
            this.logData(`Category: ${category}`);

            totalChapters = await novalInfoJSNode.$eval(
              '.author span>span',
              (e) => e.textContent || '',
            );
            this.logData(`Total Chapters: ${totalChapters}`);
          } catch (error) {
            this.logData(
              `Error getting title or URL for story: ${error.message}`,
            );
            continue;
          }

          const slug = slugify(title);
          const existingStory = await this.storyModel.findOne({ slug });
          if (existingStory) {
            this.logData(`Story already exists: ${title}`);
            continue;
          }

          const cateSlug = slugify(category);
          const cate = await this.categoryModel.findOneAndUpdate(
            { slug: cateSlug },
            { name: category, slug: cateSlug },
            { upsert: true, new: true, setDefaultsOnInsert: true },
          );

          const storyData = {
            url,
            source: this.source._id,
            slug,
            categories: [cate._id],
            totalChapters: Number(totalChapters),
            title,
            cover:
              'https://imagedelivery.net/w111oH5cwLzgQJESf-Uf2g/e3ac7ced-db9f-412f-96f0-cf272e7bc500/public',
            isDetailCrawled: false,
            isChapterCrawled: false,
          };
          await this.storyModel.findOneAndUpdate({ slug }, storyData, {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true,
          });
          await this.crawlHistoryModel.findOneAndUpdate(
            { source: this.source._id },
            {
              source: this.source._id,
              totalPage,
              currentPage: p,
            },
            { upsert: true, new: true, setDefaultsOnInsert: true },
          );
        }
      }
    } catch (error) {
      this.logData(`Error in getAllStoryOverview: ${error.message}`);
      return;
    } finally {
      await page.close();
      await browser.close();
    }
  }

  async getStoryDetail(story: Story, reUpdate = true) {
    if (!reUpdate && story.isDetailCrawled) {
      this.logData(`Story ${story.title} already has details crawled.`);
      return;
    }
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
      await page.goto(story.url);
      const slug = slugify(story.title);

      let authorImage: any = '';
      let authorName: any = '';

      this.logData(`Processing novel: ${story.title}`);

      const storyData: Partial<Story> = {
        source: this.source._id,
        slug,
        isDetailCrawled: true,
        isChapterCrawled: false,
      };

      if (!story.isDetailCrawled) {
        try {
          authorImage = await page.$eval(
            '.author-info .author-photo img',
            (e) => e.getAttribute('src'),
          );
        } catch (error) {
          this.logData(
            `Error getting author image for ${story.title}: ${error.message}`,
          );
        }

        try {
          authorName = await page.$eval(
            '.author-photo p a',
            (e) => e.textContent || '',
          );
        } catch (error) {
          this.logData(
            `Error getting author name for ${story.title}: ${error.message}`,
          );
        }

        const authorSlug = slugify(authorName);
        const author = await this.authorModel.findOneAndUpdate(
          { slug: authorSlug },
          {
            slug: authorSlug,
            name: authorName,
            image: authorImage,
          },
          { upsert: true, new: true, setDefaultsOnInsert: true },
        );

        storyData.author = author._id as any;

        try {
          const cover = await page.$eval(
            '.book-detail-wrap .book-img img',
            (e) =>
              e.getAttribute('src') ||
              'https://imagedelivery.net/w111oH5cwLzgQJESf-Uf2g/e3ac7ced-db9f-412f-96f0-cf272e7bc500/public',
          );
          storyData.cover = cover;
          this.logData(`Cover: ${cover}`);
        } catch (error) {
          this.logData(
            `Error getting cover for ${story.title}: ${error.message}`,
          );
        }

        try {
          const intro = await page.$eval(
            '.book-information .book-info .intro',
            (e) => e.textContent || '',
          );
          storyData.intro = intro;
          this.logData(`Intro: ${intro}`);
        } catch (error) {
          this.logData(
            `Error getting intro for ${story.title}: ${error.message}`,
          );
        }

        try {
          const description = await page.$eval(
            '.book-content-wrap .book-info-detail .book-intro',
            (e) => e.textContent || '',
          );
          storyData.description = description;
          this.logData(`Get Description successfully`);
        } catch (error) {
          this.logData(
            `Error getting description for ${story.title}: ${error.message}`,
          );
        }
      }

      try {
        const views = await page.$eval(
          '.book-information .book-info span[class*="-view"]',
          (e) => e.textContent || '',
        );
        storyData.views = Number(views);
        this.logData(`Views: ${views}`);
      } catch (error) {
        this.logData(
          `Error getting views for ${story.title}: ${error.message}`,
        );
      }

      try {
        const likes = await page.$eval(
          '.book-information .book-info span[class*="-like"]',
          (e) => e.textContent || '',
        );
        storyData.likes = Number(likes);
        this.logData(`Likes: ${likes}`);
      } catch (error) {
        this.logData(
          `Error getting likes for ${story.title}: ${error.message}`,
        );
      }

      try {
        const recommends = await page.$eval(
          '.book-information .book-info span[class*="-follow"]',
          (e) => e.textContent || '',
        );
        storyData.recommends = Number(recommends);
        this.logData(`Recommends: ${recommends}`);
      } catch (error) {
        this.logData(
          `Error getting recommends for ${story.title}: ${error.message}`,
        );
      }

      try {
        const votes = await page.$eval(
          '.book-information .book-info span[class*="-nomi"]',
          (e) => e.textContent || '',
        );
        storyData.votes = Number(votes);
        this.logData(`Votes: ${votes}`);
      } catch (error) {
        this.logData(
          `Error getting votes for ${story.title}: ${error.message}`,
        );
      }

      this.logData(`Novel Info: ${story.title}`);

      await this.storyModel.findOneAndUpdate({ slug }, storyData, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      });
      this.logData(`Updated story: ${story.title}`);
    } catch (error) {
      this.logData(`Error processing novel info: ${error.message}`);
    } finally {
      await page.close();
      await browser.close();
    }
  }

  async getListChapters(story: Story) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
      await page.goto(story.url);
      const chaptersTab = await page.$('#j-bookCatalogPage');
      try {
        await chaptersTab?.click();
      } catch (error) {
        this.logData(`Error clicking chapters tab: ${error.message}`);
      }

      await page.waitForTimeout(300);

      let listChapters: any[] = [];
      let nextPageBtn: any = null;

      this.logData(`...Fetching chapters for story: ${story.title}`);

      let countWhile = 0;
      this.logData(`Starting to fetch chapters... ${story.title}`);
      do {
        countWhile++;
        this.logData(`Fetching page: ${countWhile}`);
        try {
          const chapterJSNodes: any[] = await page.$$eval(
            '#max-volume ul li a[target=_blank]',
            (elements) =>
              elements.map((element) => ({
                url: element.getAttribute('href') || '',
                title: element.getAttribute('title') || '',
              })),
          );
          listChapters = [...listChapters, ...chapterJSNodes];
          try {
            nextPageBtn = await page.$('ul.pagination li a[aria-label=Next]');
            try {
              await nextPageBtn?.click();
            } catch (clickError) {
              await page.click('ul.pagination li a[aria-label=Next]');
            }

            await page.waitForTimeout(600);
          } catch (paginationError) {
            nextPageBtn = null;
          } finally {
            await sleep(600);
          }
          if (countWhile > 500) {
            this.logData(
              `Stopping after 100 iterations to prevent infinite loop.`,
            );
            break;
          }
        } catch (err) {
          this.logData(`Error getting chapter list: ${err.message}`);
        }
      } while (nextPageBtn);
      this.logData(`while loop count: ${countWhile}`);
      this.logData(
        `Found ${listChapters.length} chapters for story: ${story.title}`,
      );

      // if (listChapters.length > 350) {

      try {
        const chapterModel = await switchModelByDBLimit(this.chapter1Model, this.chapter2Model, this.chapter3Model, this.chapter4Model, this.chapter5Model)
        // @TODO: remove limit if have a better database
        for (const chapterIndex in listChapters) {
          if (
            getLimitConfig().ON &&
            Number(chapterIndex) >= getLimitConfig().DEMO_CHAPTERS_NUMBER
          ) {
            this.logData(`>> DEMO MODE: Stopping at chapter ${chapterIndex}`);
            break;
          }
          const chapterNumber = Number(chapterIndex) + 1;
          this.logData(
            `Processing chapter ${chapterNumber}: ${listChapters[chapterIndex].title}`,
          );
          const slug = slugify(
            listChapters[chapterIndex].title ||
            `story-${story.title}-chapter-${chapterNumber}`,
          );
          this.logData(`Creating chapter slug: ${slug}`);
          const chapterData = {
            chapterNumber,
            story: story._id,
            url: listChapters[chapterIndex].url,
            title: listChapters[chapterIndex].title,
            slug,
          };
          await chapterModel.findOneAndUpdate({ slug }, chapterData, {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true,
          });
          this.logData(`Created chapter: ${listChapters[chapterIndex].title}`);
        }

        await this.storyModel.findOneAndUpdate(
          { slug: story.slug },
          { isChapterCrawled: listChapters.length < 350 ? false : true },
          { new: true, upsert: true, setDefaultsOnInsert: true },
        );
      } catch (error) {
        console.log("error", error)
        this.logData(`All chapter data limited size`);
      }
      // } else {
      //   this.logData(
      //     `Ignore chapters by small number of chapters - ${listChapters.length}`,
      //   );
      // }
      this.logData(`Updated story ${story.title} with isChapterCrawled true.`);
    } catch (error) {
    } finally {
      await page.close();
      await browser.close();
    }
  }

  async getChapterContent(chapterModel: Model<Chapter>, chapter: Chapter) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    try {
      await page.goto(chapter.url);

      let content = '';
      try {
        content = await page.$eval('div.box-chap', (e) => e.innerHTML);
      } catch (error) {
        this.logData(`Error getting chapter content: ${error.message}`);
        return;
      }
      if (!content) {
        this.logData(`No content found for chapter: ${chapter.title}`);
        return;
      }

      let title = '';
      try {
        title = await page.$eval('h5 a.more-chap', (e) => e.textContent || '');
      } catch (error) {
        this.logData(`Error getting chapter title: ${error.message}`);
        return;
      }
      if (!title) {
        this.logData(`No title found for chapter: ${chapter.url}`);
        return;
      }
      chapter.title = title;
      chapter.slug = slugify(title);

      const contentModel = await switchModelByDBLimit(this.chapterContent2Model, this.chapterContent3Model, this.chapterContent4Model, this.chapterContent5Model);

      const savedContent = await contentModel.findOneAndUpdate(
        { slug: `content-${chapter.slug}` },
        {
          slug: `content-${chapter.slug}`,
          chapter: chapter.slug,
          chapterId: chapter._id,
          content
        },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
        },
      );

      chapter.content = savedContent._id;

      await chapterModel.findOneAndUpdate(
        { slug: chapter.slug },
        chapter,
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
        },
      );

      this.logData(`Updated chapter content: ${chapter.title}`);
    } catch (error) {
    } finally {
      await page.close();
      await browser.close();
    }
  }

  private async getSource() {
    if (!this.source) {
      this.source = await this.sourceModel.findOne({ name: 'Tangthuvien' });
    }
  }

  private async logData(message: string) {
    if (!this.source) {
      await this.getSource();
      this.logger.log('Source not initialized, fetching source data...');
      return;
    }

    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;

    this.logger.log(message);
    this.gateway.sendCrawlInfo(this.source._id.toString(), message);

    const logDir = path.join(__dirname, '..', '..', 'logs');

    // Tạo thư mục logs nếu chưa tồn tại
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    // Tạo tên file log dựa trên tên nguồn
    const logFile = path.join(
      logDir,
      `${this.source.name.replace(/\s+/g, '_')}.md`,
    );

    // Ghi log vào file .md
    fs.appendFileSync(logFile, logMessage);
  }
}
