import { Injectable } from '@nestjs/common';
import * as cheerio from 'cheerio';
import { ICrawlerAdapter } from './interfaces/crawler-adapter.interface';
import { slugify } from '@/utils/slugify';
import { Source } from '@/schemas/source.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Story } from '@/schemas/story.schema';
import { Author } from '@/schemas/author.schema';
import { Chapter } from "@/schemas/chapter.schema";
import { Category } from "@/schemas/category.schema";
import { Tag } from "@/schemas/tag.schema";
import { CrawlerGateway } from "../crawler.gateway";
import { axiosInstance } from "@/utils/api";

@Injectable()
export class TangthuvienCrawler implements ICrawlerAdapter {
  private source: any;

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

  async crawlStory(url: string) {
    if (!this.source) {
      await this.getSource();
    }
    try {
      const { data } = await axiosInstance.get(url);
      const $ = cheerio.load(data);

      const title = $('h1').first().text().trim();
      const description = $('.desc-text').text().trim();
      const author = $('.book-mid-info a.name').text().trim();
      const cover = $('.book img').attr('src') || '';
      const slug = slugify(title);

      const storyIdMatch = url.match(/\/(\d+)$/);
      const storyId = storyIdMatch ? storyIdMatch[1] : null;
      if (!storyId) {
        console.error(`Không tìm thấy ID truyện từ URL: ${url}`);
        this.gateway.sendCrawlInfo(this.source._id.toString(), `❌ Không tìm thấy ID truyện từ URL: ${url}`);
      };

      const chapters: {
        title: string;
        url: string;
        slug: string;
        chapterNumber: number;
      }[] = [];

      let page = 1;
      let hasMore = true;

      while (hasMore && page <= 500) {
        const chapterUrl = `https://truyen.tangthuvien.vn/doc-truyen/${storyId}/chuong-${page}`;
        try {
          const { data: pageData } = await axiosInstance.get(chapterUrl);
          const $$ = cheerio.load(pageData);

          const chapterList = $$('.col-xs-12.chapter a');

          if (chapterList.length === 0) {
            hasMore = false;
            break;
          }

          chapterList.each((i, el) => {
            const chTitle = $$(el).text().trim();
            const chUrl = 'https://truyen.tangthuvien.vn' + $$(el).attr('href');
            chapters.push({
              title: chTitle,
              url: chUrl,
              slug: slugify(chTitle),
              chapterNumber: chapters.length + 1,
            });
          });

          page++;
        } catch (err) {
          hasMore = false;
          break;
        }
      }
      return {
        title,
        slug,
        description,
        author,
        cover,
        chapters,
      };
    } catch (error) {
      console.error(`Lỗi khi crawl truyện: ${url}`, error);
      this.gateway.sendCrawlInfo(this.source._id.toString(), `❌ Lỗi khi crawl truyện: ${url}`);
      return {
        title: '',
        slug: '',
        description: undefined,
        author: undefined,
        cover: undefined,
        categories: undefined,
        tags: undefined,
        chapters: undefined,
      };
    }
  }

  async crawlChapterContent(url: string): Promise<string> {
    if (!this.source) {
      await this.getSource();
    }
    try {
      const { data } = await axiosInstance.get(url);
      const $ = cheerio.load(data);
      const contentHtml = $('.box-chap').html()?.trim() || '';
      return contentHtml;
    } catch (err) {
      console.warn(`Không thể crawl chương: ${url}`);
      this.gateway.sendCrawlInfo(this.source._id.toString(), `❌ Không thể crawl chương: ${url}`);
      return '';
    }
  }

  async crawlAllStoryUrls(successCallback?: () => void): Promise<void> {
    if (!this.source) {
      await this.getSource();
    }
    this.gateway.sendStatus(this.source._id.toString(), 'crawling');

    // Giai đoạn 1: Crawl danh sách sơ bộ
    await this.crawlStoryUrls();

    // Giai đoạn 2: Crawl chi tiết các truyện chưa crawl
    const storiesToDetail = await this.storyModel.find({ isDetailCrawled: { $ne: true } });
    for (const story of storiesToDetail) {
      await this.crawlStoryDetailBySlug(story.slug);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Giai đoạn 3: Crawl chương cho các truyện đã crawl chi tiết
    const storiesToChapter = await this.storyModel.find({
      isDetailCrawled: true,
      isChapterCrawled: { $ne: true },
    });

    for (const story of storiesToChapter) {
      await this.crawlAllChaptersForStory(story._id as string);
      await new Promise(resolve => setTimeout(resolve, 1000));
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
      const { data } = await axiosInstance.get(`${this.source.baseUrl}/ket-qua-tim-kiem?page=1`);
      const $ = cheerio.load(data);
      const pages = $('.pagination li');
      const totalPagesText = pages.last().prev().text();
      totalPages = parseInt(totalPagesText, 10);
      await this.sourceModel.updateOne({ _id: this.source._id }, { totalPages });
    } catch (err) {
      console.error(`❌ Lỗi khi lấy tổng số trang: ${err.message}`);
    }
    console.log("totalPages", totalPages);

    for (let page = currentPage; page <= totalPages; page++) {
      console.log(`📄 Đang xử lý trang ${page}/${totalPages}`);
      this.gateway.sendCrawlInfo(this.source._id.toString(), `📄 Đang xử lý trang ${page}/${totalPages}`);
      try {
        const { data: searchData } = await axiosInstance.get(`${this.source.baseUrl}/ket-qua-tim-kiem?page=${page}`);
        const $ = cheerio.load(searchData);

        const stories = $('#rank-view-list .book-img-text ul li')
          .map((_, el) => {
            const anchor = $(el).find('.book-mid-info a').first();
            const href = anchor.attr('href');
            const title = anchor.text().trim();
            console.log('crawl:', title);

            return {
              url: href?.startsWith('http') ? href : `${this.source.baseUrl}${href}`,
              title,
              slug: slugify(title),
              author: $(el).find('.author').text().trim(),
              cover: $(el).find('img').attr('src'),
              intro: $(el).find('.intro').text().trim(),
            };
          })
          .get()
          .filter(s => s.url && s.title);

        for (const s of stories) {
          if (processedSlugs.has(s.slug)) continue;

          // Tác giả
          let authorDoc: any = null;
          if (s.author) {
            const authorSlug = slugify(s.author);
            authorDoc = await this.authorModel.findOneAndUpdate(
              { slug: authorSlug },
              { name: s.author },
              { upsert: true, new: true }
            );
          }

          await this.storyModel.create({
            title: s.title,
            slug: s.slug,
            url: s.url,
            intro: s.intro,
            cover: s.cover,
            author: authorDoc?._id,
            source: this.source.name,
          });

          processedSlugs.add(s.slug);
          await this.sourceModel.updateOne(
            { _id: this.source._id },
            {
              currentPage: page,
              lastCrawledUrl: s.url,
              currentStory: s.title,
              $addToSet: { processedStorySlugs: s.slug },
              status: 'idle',
            }
          );
          console.log(`✅ Lưu truyện: ${s.title}`);
          this
        }
      } catch (err) {
        console.warn(`❌ Lỗi khi crawl trang ${page}: ${err.message}`);
        this.gateway.sendCrawlInfo(this.source._id.toString(), `❌ Lỗi khi crawl trang ${page}: ${err.message}`);
        break;
      }
    }
  }

  async crawlStoryDetailBySlug(slug: string): Promise<void> {
    if (!this.source) {
      await this.getSource();
    }
    try {
      const story = await this.storyModel.findOne({ slug });
      if (!story || story.isDetailCrawled) return;

      const { data } = await axiosInstance.get(story.url);
      const $ = cheerio.load(data);

      const description = $('.desc-text').text().trim();

      const categories = $('.info a[href*="/the-loai/"]').map((_, el) => $(el).text().trim()).get();
      const tags = $('.info a[href*="/tu-khoa/"]').map((_, el) => $(el).text().trim()).get();

      const categoryIds = await Promise.all(categories.map(async (name) => {
        const slug = slugify(name);
        const cat = await this.categoryModel.findOneAndUpdate({ slug }, { name }, { upsert: true, new: true });
        return cat._id;
      }));

      const tagIds = await Promise.all(tags.map(async (name) => {
        const slug = slugify(name);
        const tag = await this.tagModel.findOneAndUpdate({ slug }, { name }, { upsert: true, new: true });
        return tag._id;
      }));

      await this.storyModel.updateOne({ _id: story._id }, {
        description,
        categories: categoryIds,
        tags: tagIds,
        isDetailCrawled: true,
      });
      this.gateway.sendCrawlInfo(this.source._id.toString(), `📝 Cập nhật chi tiết: ${story.title}`);
      console.log(`📝 Cập nhật chi tiết: ${story.title}`);
    } catch (err) {
      console.warn(`❌ Lỗi khi crawl chi tiết truyện: ${slug}`);
      this.gateway.sendCrawlInfo(this.source._id.toString(), `❌ Lỗi khi crawl chi tiết truyện: ${slug}`);
    }
  }

  async crawlAllChaptersForStory(storyId: string): Promise<void> {
    if (!this.source) {
      await this.getSource();
    }
    try {
      const story = await this.storyModel.findById(storyId);
      if (!story || story.isChapterCrawled) return;

      const data = await this.crawlStory(story.url); // sử dụng lại logic crawlStory của bạn
      if (!data.chapters?.length) return;

      const existingChaps = await this.chapterModel.find({ story: story._id });
      const existingUrls = new Set(existingChaps.map(c => c.url));

      for (const ch of data.chapters) {
        if (existingUrls.has(ch.url)) continue;

        const content = await this.crawlChapterContent(ch.url);

        await this.chapterModel.create({
          title: ch.title,
          slug: ch.slug,
          url: ch.url,
          chapterNumber: ch.chapterNumber,
          story: story._id,
          content,
        });

        this.gateway.sendCrawlInfo(this.source._id.toString(), `📖 Lưu chương: ${ch.title}`);
        console.log(`📖 Lưu chương: ${ch.title}`);
      }

      await this.storyModel.updateOne({ _id: story._id }, { isChapterCrawled: true });
      this.gateway.sendCrawlInfo(this.source._id.toString(), `✅ Crawl chương xong: ${story.title}`);
      console.log(`✅ Crawl chương xong: ${story.title}`);
    } catch (error) {
      console.error(`Lỗi khi crawl tất cả chương cho truyện: ${storyId}`, error);
      this.gateway.sendCrawlInfo(this.source._id.toString(), `❌ Lỗi khi crawl tất cả chương cho truyện: ${storyId}`);
    }
  }

}
