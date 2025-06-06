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

import * as fs from 'fs';
import * as path from 'path';
import { DEBUG_CONFIG } from '@/utils/constants';

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
          isDetailCrawled: false, // Only get stories that haven't been detailed crawled
        })
        .populate('source');

      for (const storyIndex in allCrawledStories) {
        if (DEBUG_CONFIG.ON && DEBUG_CONFIG.DEMO_STORIES_NUMBER > 0) {
          if (Number(storyIndex) >= DEBUG_CONFIG.DEMO_STORIES_NUMBER) {
            this.logData(
              `Reached demo limit of ${DEBUG_CONFIG.DEMO_STORIES_NUMBER} stories, skipping further crawls.`,
              source,
            );
            break;
          }
        }
        const story = allCrawledStories[storyIndex];
        // get Story details
        this.logData(`Crawled story details for: ${story.title}`, source);
        // await sleep(100);
        await adapter.getStoryDetail(story);
      }

      for (const story of allCrawledStories) {
        // get Story chapters
        this.logData(`Crawled story details for: ${story.title}`, source);
        // await sleep(100);

        this.logData(`Crawling chapter list of: ${story.title}`, source);
        await adapter.getListChapters(story);
        this.logData(`Crawled chapters for: ${story.title}`, source);
      }

      this.logData(`Starting crawl chapters content`, source);
      const chapters = await this.chapterModel.find({
        content: { $exists: false },
      });
      for (const chapter of chapters) {
        try {
          this.logData(`Crawling content of chapter: ${chapter.title}`, source);
          await adapter.getChapterContent(chapter);
          // await sleep(300);
        } catch (error) {
          this.logData(
            `[[Skipped]] chapter by error ${chapter.title}: ${error.message}`,
            source,
          );
        }
        this.logData(`Crawled content for chapter: ${chapter.title}`, source);
      }
      this.logData(`Success crawl chapters content`, source);
    } catch (error) {
      this.logger.error(`Error during crawl for source ${source.name}:`, error);
      this.logData(`Error during crawl: ${error.message}`, source);
    } finally {
      this.activeCrawlMap.delete(source._id.toString());
    }
  }

  async crawlAllChapters(sourceId: string) {
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

    this.logData(`Starting crawl for source: ${source.name}`, source);

    try {
      const adapter = this.getAdapter(source.name);

      const allCrawledStories = await this.storyModel
        .find({
          source: source._id,
          isDetailCrawled: true,
          isChapterCrawled: false,
        })
        .populate('source');
      this.logData(
        `Found ${allCrawledStories.length} stories to crawl chapters for.`,
        source,
      );

      for (const story of allCrawledStories) {
        // get Story chapters
        this.logData(`Crawled story details for: ${story.title}`, source);
        // await sleep(100);

        this.logData(`Crawling chapter list of: ${story.title}`, source);
        await adapter.getListChapters(story);
        this.logData(`Completed crawling for story: ${story.title}`, source);
      }

      this.logData(`Starting crawl chapters content`, source);
      const chapters = await this.chapterModel.find({
        content: { $exists: false },
      });
      for (const chapter of chapters) {
        try {
          this.logData(`Crawling content of chapter: ${chapter.title}`, source);
          await adapter.getChapterContent(chapter);
          // await sleep(300);
        } catch (error) {
          this.logData(
            `[[Skipped]] chapter by error ${chapter.title}: ${error.message}`,
            source,
          );
        }
        this.logData(`Crawled content for chapter: ${chapter.title}`, source);
      }
    } catch (error) {
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

      const chapters = await this.chapterModel.find({
        story: story._id,
        content: { $exists: false },
      });
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
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;

    this.logger.log(message);
    this.gateway.sendCrawlInfo(source._id.toString(), message);

    const logDir = path.join(__dirname, '..', '..', 'logs');

    // Tạo thư mục logs nếu chưa tồn tại
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    // Tạo tên file log dựa trên tên nguồn
    const logFile = path.join(logDir, `${source.name.replace(/\s+/g, '_')}.md`);

    // Ghi log vào file .md
    fs.appendFileSync(logFile, logMessage);
  }
}
