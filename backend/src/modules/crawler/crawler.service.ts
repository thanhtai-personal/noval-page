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
import { Source } from "@/schemas/source.schema";

@Injectable()
export class CrawlerService {
  private readonly logger = new Logger(CrawlerService.name);
  private activeCrawlMap = new Map<string, boolean>();

  constructor(
    private readonly tangthuvien: TangthuvienCrawler,
    private readonly vtruyen: VtruyenCrawler,
    @InjectModel(Story.name) private storyModel: Model<Story>,
    @InjectModel(Chapter.name) private chapterModel: Model<Chapter>,
    @InjectModel(Source.name) private sourceModel: Model<Source>,
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    @InjectModel(Tag.name) private tagModel: Model<Tag>,
  ) {}

  private getAdapter(source: string): ICrawlerAdapter {
    switch (source.toLowerCase()) {
      case 'tangthuvien': return this.tangthuvien;
      case 'vtruyen': return this.vtruyen;
      default: throw new Error(`Unsupported source: ${source}`);
    }
  }

  async startCrawlSite(sourceId: string) {
    const source = await this.sourceModel.findById(sourceId);
    if (!source) throw new Error('Source not found');
  
    if (this.activeCrawlMap.get(source.name)) {
      this.logger.warn(`⚠️ Đã crawl "${source.name}" rồi`);
      return;
    }
  
    const adapter = this.getAdapter(source.name);
    this.activeCrawlMap.set(source.name, true);
  
    await this.sourceModel.updateOne({ _id: sourceId }, { status: 'crawling' });
  
    try {
      await adapter.getAllStoryUrls();
    } catch (err) {
      this.logger.error(`❌ Crawl lỗi: ${err.message}`);
    }
  
    await this.sourceModel.updateOne({ _id: sourceId }, { status: 'idle' });
    this.activeCrawlMap.set(source.name, false);
  }

  cancelCrawlSite(sourceId: string) {
    this.sourceModel.findById(sourceId).then(source => {
      if (source) {
        this.logger.warn(`⛔ Hủy crawl: ${source.name}`);
        this.activeCrawlMap.set(source.name, false);
        this.sourceModel.updateOne({ _id: source._id }, { status: 'idle' }).exec();
      }
    });
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
