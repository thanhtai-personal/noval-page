import { Injectable } from '@nestjs/common';
import * as cheerio from 'cheerio';
import { ICrawlerAdapter } from './interfaces/crawler-adapter.interface';
import { slugify } from '@/utils/slugify';
import { Source } from '@/schemas/source.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Story } from '@/schemas/story.schema';
import { Author } from '@/schemas/author.schema';
import { Chapter } from '@/schemas/chapter.schema';
import { Category } from '@/schemas/category.schema';
import { Tag } from '@/schemas/tag.schema';
import { CrawlerGateway } from '../crawler.gateway';
import { axiosInstance } from '@/utils/api';
import puppeteer from 'puppeteer';

const DEMO_STORIES_NUMBER = 50,
  DEMO_CHAPTERS_NUMBER = 500,
  DEMO_CRAWL_PAGES = 5;

@Injectable()
export class TangthuvienCrawler implements ICrawlerAdapter {
  private source: any;
  private readonly debugMode = process.env.DEBUG_CRAWL === 'true';

  constructor(
    private readonly gateway: CrawlerGateway,
    @InjectModel(Source.name) private sourceModel: Model<Source>,
    @InjectModel(Story.name) private storyModel: Model<Story>,
    @InjectModel(Author.name) private authorModel: Model<Author>,
    @InjectModel(Chapter.name) private chapterModel: Model<Chapter>,
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    @InjectModel(Tag.name) private tagModel: Model<Tag>,
  ) {
    this.getSource();
  }

  async getSource() {
    if (!this.source) {
      this.source = await this.sourceModel.findOne({ name: 'Tangthuvien' });
    }
  }

  private async getChaptersFromStory(
    story: any,
    storySlug: string,
  ): Promise<void> {
    try {
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
      const page = await browser.newPage();
      await page.goto(story.url, { waitUntil: 'networkidle2' });

      // Mở tab danh sách chương
      await page.waitForSelector('#j-tab-menu a[href="#j-bookCatalogPage"]', {
        timeout: 5000,
      });
      await page.click('#j-tab-menu a[href="#j-bookCatalogPage"]');
      await page.waitForSelector('#j-bookCatalogPage ul > li', {
        timeout: 5000,
      });

      const chapterUrls = new Set<string>();
      const chapters: { title: string; url: string; chapterNumber: number }[] =
        [];

      let pageCount = 1;
      while (true) {
        console.log(`📄 Crawling chương - Trang ${pageCount}`);

        const newChapters = await page.$$eval(
          '#j-bookCatalogPage ul > li a',
          (links) =>
            links.map((link) => ({
              title: link.textContent?.trim() || '',
              url: link.getAttribute('href') || '',
            })),
        );

        for (const item of newChapters) {
          if (!item.url || chapterUrls.has(item.url)) continue;
          chapterUrls.add(item.url);

          const chapterNumberMatch = item.title.match(/Chương\s+(\d+)/i);
          const chapterNumber = chapterNumberMatch
            ? parseInt(chapterNumberMatch[1], 10)
            : chapters.length + 1;

          chapters.push({
            title: item.title,
            url: item.url,
            chapterNumber,
          });

          console.log(`📚 Chương ${chapterNumber}: ${item.title}`);
        }

        // Kiểm tra nút next
        const hasNext = await page.$(
          '.pagination a[rel="next"]:not(.disabled)',
        );
        if (!hasNext) break;

        await Promise.all([
          hasNext.click(),
          page
            .waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 })
            .catch(() => null),
        ]);

        await page.waitForSelector('#j-bookCatalogPage ul > li', {
          timeout: 5000,
        });
        pageCount++;
      }

      // Lưu số chương
      await this.storyModel.findByIdAndUpdate(story._id, {
        totalChapters: chapters.length,
      });

      for (const ch of chapters) {
        const slug = `${storySlug}-${ch.url.split('/').pop()}`;
        await this.chapterModel.updateOne(
          { slug },
          {
            title: ch.title,
            url: ch.url,
            slug,
            chapterNumber: ch.chapterNumber,
            story: story._id,
          },
          { upsert: true },
        );

        this.gateway.sendCrawlInfo(
          this.source._id.toString(),
          `📚 Tạo chương ${ch.chapterNumber}: ${ch.title}`,
        );
      }

      await browser.close();
      this.gateway.sendCrawlInfo(
        this.source._id.toString(),
        `✅ Tổng số chương lấy được: ${chapters.length}`,
      );
    } catch (err) {
      console.warn(`❌ Lỗi crawl danh sách chương: ${storySlug}`, err);
      this.gateway.sendCrawlInfo(
        this.source._id.toString(),
        `❌ Lỗi crawl danh sách chương: ${storySlug}`,
      );
    }
  }

  async crawlStory(story: any) {
    if (!this.source) await this.getSource();

    try {
      const { data } = await axiosInstance.get(story.url);
      const $ = cheerio.load(data);

      const title = $('h1').first().text().trim();
      const description = $('.desc-text').text().trim();
      const author = $('.info a[href*="/tac-gia/"]').text().trim();
      const cover = $('.book img').attr('src') || '';
      const slug = slugify(title);

      console.log(`Duyệt danh sách chương`);
      this.gateway.sendCrawlInfo(
        this.source._id.toString(),
        `Duyệt danh sách chương`,
      );
      await this.getChaptersFromStory(story, slug);

      return {
        title,
        slug,
        description,
        author,
        cover,
      };
    } catch (error) {
      console.error(`Lỗi khi crawl truyện: ${story.url}`, error);
      this.gateway.sendCrawlInfo(
        this.source._id.toString(),
        `❌ Lỗi khi crawl truyện: ${story.url}`,
      );
      return {
        title: '',
        slug: '',
        description: undefined,
        author: undefined,
        cover: undefined,
        categories: undefined,
        tags: undefined,
      };
    }
  }

  async crawlChapterContent(url: string): Promise<any> {
    if (!this.source) {
      await this.getSource();
    }
    try {
      console.log(`Crawl chương: ${url}`);
      const { data } = await axiosInstance.get(url);
      const $ = cheerio.load(data);
      const title = $('.chapter-c-content a.more-chap').first().text().trim();
      return {
        content: $('.box-chap').first().html()?.trim() || '',
        title: title,
      };
    } catch (err) {
      console.warn(`Không thể crawl chương: ${url}`, err.message);
      this.gateway.sendCrawlInfo(
        this.source._id.toString(),
        `❌ Không thể crawl chương: ${url}`,
      );
      return {};
    }
  }

  async crawlAllStoryUrls(successCallback?: () => void): Promise<void> {
    if (!this.source) {
      await this.getSource();
    }
    this.gateway.sendStatus(this.source._id.toString(), 'crawling');

    await this.crawlStoryUrls();

    const storiesToDetail = await this.storyModel.find();
    const detailList = this.debugMode
      ? storiesToDetail.slice(0, DEMO_STORIES_NUMBER)
      : storiesToDetail;
    for (const story of detailList) {
      await this.crawlStoryDetailBySlug(story.slug);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    const storiesToChapter = await this.storyModel.find({
      isDetailCrawled: true,
    });
    const chapterList = this.debugMode
      ? storiesToChapter.slice(0, DEMO_CHAPTERS_NUMBER)
      : storiesToChapter;
    for (const story of chapterList) {
      await this.crawlAllChaptersForStory(story._id as string);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    this.gateway.sendStatus(this.source._id.toString(), 'idle');
    successCallback?.();
    console.log('🏁 Crawl site Tangthuvien hoàn tất.');
  }

  async crawlStoryUrls(): Promise<void> {
    if (!this.source) {
      await this.getSource();
    }
    console.log(`🔍 Bắt đầu crawl site: ${this.source.baseUrl}`);
    let currentPage = this.source.currentPage || 1;
    let totalPages = this.source.totalPages || 0;
    const processedSlugs = new Set(this.source.processedStorySlugs || []);

    try {
      const { data } = await axiosInstance.get(
        `${this.source.baseUrl}/ket-qua-tim-kiem?page=1`,
      );
      const $ = cheerio.load(data);
      const pages = $('.pagination li');
      const totalPagesText = pages.last().prev().text();
      totalPages = parseInt(totalPagesText, 10);
      await this.sourceModel.updateOne(
        { _id: this.source._id },
        { totalPages },
      );
    } catch (err) {
      console.error(`❌ Lỗi khi lấy tổng số trang: ${err.message}`);
    }

    for (let page = currentPage; page <= totalPages; page++) {
      if (this.debugMode && page > DEMO_CRAWL_PAGES) break;
      console.log(`📄 Đang xử lý trang ${page}/${totalPages}`);
      this.gateway.sendCrawlInfo(
        this.source._id.toString(),
        `📄 Đang xử lý trang ${page}/${totalPages}`,
      );

      try {
        const { data: searchData } = await axiosInstance.get(
          `${this.source.baseUrl}/ket-qua-tim-kiem?page=${page}`,
        );
        const $ = cheerio.load(searchData);

        const stories = $('#rank-view-list .book-img-text ul li')
          .map((_, el) => {
            const anchor = $(el).find('.book-mid-info a').first();
            const href = anchor.attr('href');
            const title = anchor.text().trim();
            return {
              url: href?.startsWith('http')
                ? href
                : `${this.source.baseUrl}${href}`,
              title,
              slug: slugify(title),
              author: $(el).find('.author a.name').text().trim(),
              category: $(el)
                .find('.author a[href*="/the-loai/"]')
                .text()
                .trim(),
              cover: $(el).find('img').attr('src'),
              intro: $(el).find('.intro').text().trim(),
            };
          })
          .get()
          .filter((s) => s.url && s.title);

        for (const s of stories) {
          if (processedSlugs.has(s.slug)) continue;

          let authorDoc: any = null;
          if (s.author) {
            const authorSlug = slugify(s.author);
            authorDoc = await this.authorModel.findOneAndUpdate(
              { slug: authorSlug },
              { name: s.author },
              { upsert: true, new: true },
            );
          }

          let categoryDoc: any = null;
          if (s.category) {
            const categorySlug = slugify(s.category);
            categoryDoc = await this.categoryModel.findOneAndUpdate(
              { slug: categorySlug },
              { name: s.category },
              { upsert: true, new: true },
            );
          }

          await this.storyModel.updateOne(
            { slug: s.slug },
            {
              title: s.title,
              slug: s.slug,
              url: s.url,
              intro: s.intro,
              cover: s.cover,
              author: authorDoc?._id,
              categories: [categoryDoc?._id],
              source: this.source.name,
            },
            { upsert: true, new: true },
          );

          processedSlugs.add(s.slug);
          await this.sourceModel.updateOne(
            { _id: this.source._id },
            {
              currentPage: page,
              lastCrawledUrl: s.url,
              currentStory: s.title,
              $addToSet: { processedStorySlugs: s.slug },
              status: 'idle',
            },
          );
          console.log(`✅ Lưu truyện: ${s.title}`);
        }
      } catch (err) {
        console.warn(`❌ Lỗi khi crawl trang ${page}: ${err.message}`);
        this.gateway.sendCrawlInfo(
          this.source._id.toString(),
          `❌ Lỗi khi crawl trang ${page}: ${err.message}`,
        );
        break;
      }
    }
  }

  async crawlStoryDetailBySlug(slug: string): Promise<void> {
    if (!this.source) await this.getSource();
    try {
      const story = await this.storyModel.findOne({ slug });
      if (!story || story.isDetailCrawled) return;

      const { data } = await axiosInstance.get(story.url);
      const $ = cheerio.load(data);

      const description = $('.book-intro').html()?.trim() || '';
      const categories = $('.info a[href*="/the-loai/"]')
        .map((_, el) => $(el).text().trim())
        .get();
      const tags = $('.info a[href*="/tu-khoa/"]')
        .map((_, el) => $(el).text().trim())
        .get();

      const categoryIds = await Promise.all(
        categories.map(async (name) => {
          const slug = slugify(name);
          const cat = await this.categoryModel.findOneAndUpdate(
            { slug },
            { name },
            { upsert: true, new: true },
          );
          return cat._id;
        }),
      );

      const tagIds = await Promise.all(
        tags.map(async (name) => {
          const slug = slugify(name);
          const tag = await this.tagModel.findOneAndUpdate(
            { slug },
            { name },
            { upsert: true, new: true },
          );
          return tag._id;
        }),
      );

      const likes =
        parseInt($('.book-info span[class*="-like"]').text().trim()) || 0;
      const views =
        parseInt($('.book-info span[class*="-view"]').text().trim()) || 0;
      const recommends =
        parseInt($('.book-info span[class*="-follow"]').text().trim()) || 0;
      const votes =
        parseInt($('.book-info span[class*="-nomi"]').text().trim()) || 0;

      await this.storyModel.updateOne(
        { _id: story._id },
        {
          description,
          categories: categoryIds,
          tags: tagIds,
          isDetailCrawled: true,
          likes,
          views,
          recommends,
          votes,
        },
      );

      console.log(`📝 Cập nhật chi tiết: ${story.title}`);
      this.gateway.sendCrawlInfo(
        this.source._id.toString(),
        `📝 Cập nhật chi tiết: ${story.title}`,
      );
    } catch (err) {
      console.warn(`❌ Lỗi khi crawl chi tiết truyện: ${slug}`);
      this.gateway.sendCrawlInfo(
        this.source._id.toString(),
        `❌ Lỗi khi crawl chi tiết truyện: ${slug}`,
      );
    }
  }

  async crawlAllChaptersForStory(storyId: string): Promise<void> {
    if (!this.source) await this.getSource();
    try {
      const story = await this.storyModel.findById(storyId);
      if (!story) {
        console.log(`❌ Không tìm thấy truyện với ID: ${storyId}`);
        this.gateway.sendCrawlInfo(
          this.source._id.toString(),
          `❌ Không tìm thấy truyện với ID: ${storyId}`,
        );
        return;
      }

      await this.crawlStory(story);
      const chapters = await this.chapterModel.find({ story: storyId });

      for (const ch of chapters) {
        if (ch?.content) continue;

        const dataUpdated = (await this.crawlChapterContent(ch.url)) || {};
        await this.chapterModel.findOneAndUpdate({ _id: ch._id }, dataUpdated, {
          upsert: true,
          new: true,
        });
        console.log(`📖 Lưu chương: ${dataUpdated.title}`);
        this.gateway.sendCrawlInfo(
          this.source._id.toString(),
          `📖 Lưu chương: ${dataUpdated.title}`,
        );
      }

      await this.storyModel.updateOne(
        { _id: story._id },
        { isChapterCrawled: true },
      );
      console.log(`✅ Crawl chương xong: ${story.title}`);
      this.gateway.sendCrawlInfo(
        this.source._id.toString(),
        `✅ Crawl chương xong: ${story.title}`,
      );
    } catch (error) {
      console.log(`❌ Lỗi khi crawl tất cả chương cho truyện: ${storyId}`);
      this.gateway.sendCrawlInfo(
        this.source._id.toString(),
        `❌ Lỗi khi crawl tất cả chương cho truyện: ${storyId}`,
      );
    }
  }
}
