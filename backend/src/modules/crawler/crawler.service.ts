import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Story } from '@/schemas/story.schema';
import { Chapter } from '@/schemas/chapter.schema';
import { Author } from '@/schemas/author.schema';
import { Category } from '@/schemas/category.schema';
import { Tag } from '@/schemas/tag.schema';

import { TangthuvienCrawler } from './sites/tangthuvien.crawler';
import { VtruyenCrawler } from './sites/vtruyen.crawler';
import { ICrawlerAdapter } from './sites/interfaces/crawler-adapter.interface';
import { slugify } from '@/utils/slugify';

@Injectable()
export class CrawlerService {
  private readonly logger = new Logger(CrawlerService.name);
  private activeCrawlMap = new Map<string, boolean>();

  constructor(
    private readonly tangthuvien: TangthuvienCrawler,
    private readonly vtruyen: VtruyenCrawler,
    @InjectModel(Story.name) private storyModel: Model<Story>,
    @InjectModel(Chapter.name) private chapterModel: Model<Chapter>,
    @InjectModel(Author.name) private authorModel: Model<Author>,
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    @InjectModel(Tag.name) private tagModel: Model<Tag>,
  ) {}

  private getAdapter(source: string): ICrawlerAdapter {
    switch (source) {
      case 'tangthuvien': return this.tangthuvien;
      case 'vtruyen': return this.vtruyen;
      default: throw new Error(`Unsupported source: ${source}`);
    }
  }

  async startCrawlSite(source: string) {
    if (this.activeCrawlMap.get(source)) {
      this.logger.warn(`⚠️ Crawl đã đang chạy cho "${source}"`);
      return;
    }

    const adapter = this.getAdapter(source);
    this.activeCrawlMap.set(source, true);
    const storyUrls = await adapter.getAllStoryUrls();

    for (const url of storyUrls) {
      if (!this.activeCrawlMap.get(source)) {
        this.logger.warn(`⛔ Crawl site "${source}" bị huỷ`);
        break;
      }

      try {
        const data = await adapter.crawlStory(url);

        let authorDoc: any = null;
        if (data.author) {
          const slug = slugify(data.author);
          authorDoc = await this.authorModel.findOneAndUpdate(
            { slug },
            { name: data.author },
            { upsert: true, new: true }
          );
        }

        const categoryIds = await Promise.all((data.categories || []).map(async name => {
          const slug = slugify(name);
          const cat = await this.categoryModel.findOneAndUpdate(
            { slug },
            { name },
            { upsert: true, new: true }
          );
          return cat._id;
        }));

        const tagIds = await Promise.all((data.tags || []).map(async name => {
          const slug = slugify(name);
          const tag = await this.tagModel.findOneAndUpdate(
            { slug },
            { name },
            { upsert: true, new: true }
          );
          return tag._id;
        }));

        let story = await this.storyModel.findOne({ slug: data.slug });
        if (!story) {
          story = await this.storyModel.create({
            title: data.title,
            slug: data.slug,
            description: data.description,
            cover: data.cover,
            author: authorDoc?._id || null,
            source,
            url,
            categories: categoryIds,
            tags: tagIds,
          });
        }

        const existingChapters = await this.chapterModel.find({ story: story._id });
        const existingUrls = new Set(existingChapters.map(ch => ch.url));

        for (const ch of (data.chapters || [])) {
          if (existingUrls.has(ch.url)) continue;

          const content = await adapter.crawlChapterContent(ch.url);
          await this.chapterModel.create({
            title: ch.title,
            slug: ch.slug,
            url: ch.url,
            chapterNumber: ch.chapterNumber,
            story: story._id,
            content,
          });
        }

        this.logger.log(`✅ Done: ${data.title}`);
      } catch (err) {
        this.logger.error(`❌ Lỗi crawl truyện: ${url} – ${err.message}`);
      }
    }

    this.activeCrawlMap.set(source, false);
  }

  cancelCrawlSite(source: string) {
    this.logger.warn(`⛔ Đánh dấu huỷ crawl site: ${source}`);
    this.activeCrawlMap.set(source, false);
  }

  async crawlStoryById(storyId: string) {
    const story = await this.storyModel.findById(storyId);
    if (!story) throw new Error('Story not found');

    const adapter = this.getAdapter(story.source);
    const data = await adapter.crawlStory(story.url);

    const existingChapters = await this.chapterModel.find({ story: story._id });
    const existingUrls = new Set(existingChapters.map(ch => ch.url));

    for (const ch of (data.chapters || [])) {
      if (existingUrls.has(ch.url)) continue;

      const content = await adapter.crawlChapterContent(ch.url);
      await this.chapterModel.create({
        title: ch.title,
        slug: ch.slug,
        url: ch.url,
        chapterNumber: ch.chapterNumber,
        story: story._id,
        content,
      });
    }

    this.logger.log(`✅ Crawl thêm chương mới cho "${story.title}"`);
    return { message: 'Crawl thành công', added: (data.chapters?.length || 0) - existingChapters.length };
  }
}
