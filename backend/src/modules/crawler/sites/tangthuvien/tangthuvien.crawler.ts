import { Injectable, Logger } from '@nestjs/common';
import * as cheerio from 'cheerio';
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

const DEBUG_CONFIG = {
  ON: false, //process.env.DEBUG_CRAWL === 'true',
  DEMO_STORIES_NUMBER: 50,
  DEMO_CHAPTERS_NUMBER: 500,
  DEMO_CRAWL_PAGES: 5,
};

const ttvSearchPath = 'https://truyen.tangthuvien.vn/tong-hop?rank=vw&page=';

@Injectable()
export class TangthuvienCrawler implements ICrawlerAdapter {
  private source: any;
  private readonly logger = new Logger(TangthuvienCrawler.name);

  constructor(
    private readonly gateway: CrawlerGateway,
    @InjectModel(Source.name) private sourceModel: Model<Source>,
    @InjectModel(Story.name) private storyModel: Model<Story>,
    @InjectModel(CrawlHistory.name)
    private crawlHistoryModel: Model<CrawlHistory>,
    @InjectModel(Author.name) private authorModel: Model<Author>,
    @InjectModel(Chapter.name) private chapterModel: Model<Chapter>,
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    @InjectModel(Tag.name) private tagModel: Model<Tag>,
  ) {
    this.getSource();
  }

  async getAllStoryOverview() {
    await this.getSource();
    try {
      const currentStories = await this.storyModel.find({});
      this.logData(
        `>> Found ${currentStories.length} stories in the database.`,
      );

      if (
        currentStories.length >= DEBUG_CONFIG.DEMO_STORIES_NUMBER &&
        DEBUG_CONFIG.ON
      ) {
        // Nếu đang ở chế độ demo, chỉ lấy một số lượng stories nhất định
        this.logData(
          `>> DEMO MODE: Skipping story overview crawl. Found ${currentStories.length} stories.`,
        );
        return;
      }

      // Lấy record được tạo ra cuối cùng từ crawlHistoryModel
      const lastCrawlRecord = (await this.crawlHistoryModel
        .findOne({ source: this.source._id })
        .sort({ createdAt: -1 })) || {
        source: this.source._id,
        totalPage: 0,
        currentPage: 1,
      };

      const browser = await puppeteer.launch();
      const page = await browser.newPage();
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
        if (DEBUG_CONFIG.ON && p > DEBUG_CONFIG.DEMO_CRAWL_PAGES) {
          this.logData(`>> DEMO MODE: Stopping at page ${p}`);
          break;
        }

        this.logData(`>>LOAD PAGE ${p} - ${new Date().toISOString()}`);
        await page.goto(`${ttvSearchPath}${p}`);

        const novalsInfoNodes = await page.$$('div.book-img-text ul li');
        for (const novalInfoJSNode of novalsInfoNodes) {
          let title, url;
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
            this.logData(`Story URL: ${url}`);
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
          const storyData = {
            url,
            source: this.source._id,
            slug,
            title,
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
    }
  }

  async getStoryDetail(story: Story) {
    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(story.url);

      const novalName = await page.$eval(
        '.book-mid-info h4 a',
        (e) => e.textContent || 'no-name',
      );
      const ttvUrl = await page.$eval('.book-img-box a', (e) =>
        e.getAttribute('href'),
      );
      const slug = slugify(novalName);

      let authorImage: any = '';
      let authorName: any = '';

      try {
        authorImage = await page.$eval('.book-mid-info .author img', (e) =>
          e.getAttribute('src'),
        );
      } catch (error) {
        this.logData(
          `Error getting author image for ${novalName}: ${error.message}`,
        );
      }

      try {
        authorName = await page.$eval(
          '.book-mid-info .author img',
          (e) => e.textContent || '',
        );
      } catch (error) {
        this.logData(
          `Error getting author name for ${novalName}: ${error.message}`,
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

      let cover,
        status,
        totalChapters,
        intro,
        description,
        views,
        likes,
        recommends,
        votes;
      this.logData(`Processing novel: ${novalName}`);
      try {
        cover = await page.$eval(
          '.book-img-box a img',
          (e) => e.getAttribute('alt') || '',
        );
      } catch (error) {
        this.logData(`Error getting cover for ${novalName}: ${error.message}`);
      }
      try {
        status = await page.$eval(
          '.book-mid-info span',
          (e) => e.textContent || '',
        );
      } catch (error) {
        this.logData(`Error getting status for ${novalName}: ${error.message}`);
      }
      try {
        totalChapters = await page.$eval(
          '.book-mid-info span span',
          (e) => e.textContent || '',
        );
      } catch (error) {
        this.logData(
          `Error getting total chapters for ${novalName}: ${error.message}`,
        );
      }
      try {
        intro = await page.$eval(
          '.book-mid-info .intro',
          (e) => e.textContent || '',
        );
      } catch (error) {
        this.logData(`Error getting intro for ${novalName}: ${error.message}`);
      }
      try {
        description = await page.$eval(
          '.book-mid-info .book-intro',
          (e) => e.textContent || '',
        );
      } catch (error) {
        this.logData(
          `Error getting description for ${novalName}: ${error.message}`,
        );
      }
      try {
        views = await page.$eval(
          '.book-mid-info span[class="-view"]',
          (e) => e.textContent || '',
        );
      } catch (error) {
        this.logData(`Error getting views for ${novalName}: ${error.message}`);
      }
      try {
        likes = await page.$eval(
          '.book-mid-info span[class="-like"]',
          (e) => e.textContent || '',
        );
      } catch (error) {
        this.logData(`Error getting likes for ${novalName}: ${error.message}`);
      }
      try {
        recommends = await page.$eval(
          '.book-mid-info span[class="-follow"]',
          (e) => e.textContent || '',
        );
      } catch (error) {
        this.logData(
          `Error getting recommends for ${novalName}: ${error.message}`,
        );
      }
      try {
        votes = await page.$eval(
          '.book-mid-info span[class="-nomi"]',
          (e) => e.textContent || '',
        );
      } catch (error) {
        this.logData(`Error getting votes for ${novalName}: ${error.message}`);
      }
      if (!cover) {
        cover = 'https://tangthuvien.vn/images/no-cover.png';
      }
      this.logData(
        `Novel Info: ${novalName}, Author: ${author.name}, Status: ${status}, Total Chapters: ${totalChapters}`,
      );

      const storyData = {
        url: ttvUrl,
        source: this.source._id,
        slug,
        cover,
        title: novalName,
        author: author._id,
        authorName: author.name,
        status,
        totalChapters: Number(totalChapters),
        intro,
        description,
        views: Number(views),
        likes: Number(likes),
        recommends: Number(recommends),
        votes: Number(votes),
        isDetailCrawled: true,
        isChapterCrawled: false,
      };

      await this.storyModel.findOneAndUpdate({ slug }, storyData, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      });
      this.logData(`Created story: ${storyData.title}`);
    } catch (error) {
      this.logData(`Error processing novel info: ${error.message}`);
    }
  }

  async getListChapters(story: Story) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(story.url);

    const chaptersTab = await page.$('#j-bookCatalogPage');
    try {
      await chaptersTab?.click();
    } catch (error) {
      this.logData(`Error clicking chapters tab: ${error.message}`);
    }

    await page.waitForTimeout(50);

    const listChapters: any[] = [];
    let nextPageBtn: any = null;

    this.logData(`...Fetching chapters for story: ${story.title}`);
    do {
      try {
        const chapterJSNodes: any[] = await page.$$eval(
          '#max-volume ul li a[target=_blank]',
          (elements) =>
            elements.map((element) => ({
              url: element.getAttribute('href') || '',
              title: element.getAttribute('title') || '',
            })),
        );

        listChapters.push(...chapterJSNodes);
        try {
          nextPageBtn = await page.$('ul.pagination li a[aria-label=Next]');
          const activeBtnText = await page.$eval(
            'ul.pagination li.active a',
            (e) => e.textContent || '',
          );
          try {
            await nextPageBtn?.click();
          } catch (clickError) {
            await page.click('ul.pagination li a[aria-label=Next]');
          }

          await page.waitForTimeout(0);
        } catch (paginationError) {
          nextPageBtn = null;
        }
      } catch (err) {
        this.logData(`Error getting chapter list: ${err.message}`);
      }
    } while (nextPageBtn);
    this.logData(
      `Found ${listChapters.length} chapters for story: ${story.title}`, 
    );

    for (const chapterIndex in listChapters) {
      if (
        DEBUG_CONFIG.ON &&
        Number(chapterIndex) >= DEBUG_CONFIG.DEMO_CHAPTERS_NUMBER
      ) {
        this.logData(`>> DEMO MODE: Stopping at chapter ${chapterIndex}`);
        break;
      }
      this.logData(
        `Processing chapter ${Number(chapterIndex) + 1}: ${listChapters[chapterIndex].title}`,
      );
      const slug = slugify(
        listChapters[chapterIndex].title ||
          `story-${story.title}-chapter-${chapterIndex}`,
      );
      const chapterData = {
        chapterNumber: Number(chapterIndex) + 1,
        story: story._id,
        url: listChapters[chapterIndex].url,
        title: listChapters[chapterIndex].title,
        slug,
      };
      await this.chapterModel.findOneAndUpdate({ slug }, chapterData, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      });
      this.logData(`Created chapter: ${listChapters[chapterIndex].title}`);
    }

    await browser.close();
  }

  async getChapterContent(chapter: Chapter) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(chapter.url);

    let content = '';
    try {
      content = await page.$eval('div.box-chap', (e) => e.innerHTML);
    } catch (error) {
      this.logData(`Error getting chapter content: ${error.message}`);
      await browser.close();
      return;
    }
    if (!content) {
      this.logData(`No content found for chapter: ${chapter.title}`);
      await browser.close();
      return;
    }

    let title = '';
    try {
      title = await page.$eval('h5 a.more-chap', (e) => e.textContent || '');
    } catch (error) {
      this.logData(`Error getting chapter title: ${error.message}`);
      await browser.close();
      return;
    }
    if (!title) {
      this.logData(`No title found for chapter: ${chapter.url}`);
      await browser.close();
      return;
    }
    chapter.content = content;
    chapter.title = title;
    chapter.slug = slugify(title);

    await this.chapterModel.findOneAndUpdate({ slug: chapter.slug }, chapter, {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    });

    this.logData(`Updated chapter content: ${chapter.title}`);
    await browser.close();
  }

  private async getSource() {
    if (!this.source) {
      this.source = await this.sourceModel.findOne({ name: 'Tangthuvien' });
    }
  }

  private logData(message: string) {
    if (!this.source) {
      this.getSource();
      this.logger.log('Source not initialized, fetching source data...');
      return;
    }
    this.logger.log(message);
    this.gateway.sendCrawlInfo(this.source._id.toString(), message);
  }
}
