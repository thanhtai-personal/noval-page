import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Story } from '@/schemas/story.schema';
import { Chapter } from '@/schemas/chapter.schema';

import { TangthuvienCrawler } from './sites/tangthuvien/tangthuvien.crawler';
import { VtruyenCrawler } from './sites/vtruyen.crawler';
import { ICrawlerAdapter } from './sites/interfaces/crawler-adapter.interface';
import { Source } from '@/schemas/source.schema';
import { CrawlerGateway } from './crawler.gateway';
import { sleep } from '@/utils/functions';

@Injectable()
export class CrawlerService {
  private readonly logger = new Logger(CrawlerService.name);
  private activeCrawlMap = new Map<string, boolean>();

  constructor(
    private readonly tangthuvien: TangthuvienCrawler,
    private readonly vtruyen: VtruyenCrawler,
    private readonly gateway: CrawlerGateway,
    @InjectModel(Story.name) private storyModel: Model<Story>,
    @InjectModel(Chapter.name) private chapterModel: Model<Chapter>,
    @InjectModel(Source.name) private sourceModel: Model<Source>,
  ) {}

  private getAdapter(source: string): ICrawlerAdapter {
    switch (source.toLowerCase()) {
      case 'tangthuvien':
        return this.tangthuvien;
      case 'vtruyen':
        return this.vtruyen;
      default:
        throw new Error(`Unsupported source: ${source}`);
    }
  }

  async startCrawlSite(sourceId: string) {
    const source = await this.sourceModel.findById(sourceId);
    if (!source) {
      this.logData(`Source with ID ${sourceId} not found.`, source);
      return;
    }

    if (this.activeCrawlMap.get(source._id.toString())) {
      this.logData(
        `Crawl for source ${source.name} is already in progress.`,
        source,
      );
      return;
    }

    this.activeCrawlMap.set(source._id.toString(), true);
    this.logData(`Starting crawl for source: ${source.name}`, source);

    try {
      const adapter = this.getAdapter(source.name);
      await adapter.getAllStoryOverview();
      this.logData(`Crawl completed for source: ${source.name}`, source);

      const allCrawledStories = await this.storyModel
        .find({
          source: source._id,
        })
        .populate('source');

      for (const story of allCrawledStories) {
        this.logData(`Crawled story details for: ${story.title}`, source);
        await adapter.getStoryDetail(story);
        await sleep(1000000); // Thêm thời gian chờ giữa các yêu cầu để tránh quá tải
        
        this.logData(`Crawling chapter list of: ${story.title}`, source);
        await adapter.getListChapters(story);
        this.logData(`Crawled chapters for: ${story.title}`, source);
        const chapters = await this.chapterModel.find({ story: story._id });
        for (const chapter of chapters) {
          this.logData(`Crawling content of chapter: ${chapter.title}`, source);
          await adapter.getChapterContent(chapter);
          this.logData(`Crawled content for chapter: ${chapter.title}`, source);
        }
        this.logData(`Completed crawling for story: ${story.title}`, source);
      }
    } catch (error) {
      this.logger.error(`Error during crawl for source ${source.name}:`, error);
      this.logData(`Error during crawl: ${error.message}`, source);
    } finally {
      this.activeCrawlMap.delete(source._id.toString());
    }
  }

  async crawlStoryById(storyId: string) {
    const story = await this.storyModel.findById(storyId).populate('source');
    if (!story) {
      this.logger.error(`Story with ID ${storyId} not found.`);
      return;
    }

    const source: any = story.source;
    if (!source) {
      this.logger.error(`Source for story ${story.title} not found.`);
      return;
    }

    this.logData(`Starting crawl for story: ${story.title}`, source);

    try {
      const adapter = this.getAdapter(source.name);
      await adapter.getStoryDetail(story);
      this.logData(`Crawled story details for: ${story.title}`, source);
      await adapter.getListChapters(story);
      this.logData(`Crawled chapters for story: ${story.title}`, source);

      const chapters = await this.chapterModel.find({ story: story._id });
      for (const chapter of chapters) {
        this.logData(`Crawling content of chapter: ${chapter.title}`, source);
        await adapter.getChapterContent(chapter);
        this.logData(`Crawled content for chapter: ${chapter.title}`, source);
      }
      this.logData(`Completed crawling for story: ${story.title}`, source);
    } catch (error) {
      this.logger.error(`Error during crawl for story ${story.title}:`, error);
      this.logData(`Error during crawl: ${error.message}`, source);
    }
  }

  async crawlNewStoriesOnly(sourceName: string) {}

  private logData(message: string, source: any) {
    this.logger.log(message);
    this.gateway.sendCrawlInfo(source._id.toString(), message);
  }
}
