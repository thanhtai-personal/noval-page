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
// import { sleep } from '@/utils/functions';

// import * as fs from 'fs';
// import * as path from 'path';
import { getLimitConfig } from '@/utils/constants';
import { DBNames } from "@/utils/database";

@Injectable()
export class CrawlerService {
  private readonly logger = new Logger(CrawlerService.name);
  private activeCrawlMap = new Map<string, boolean>();

  constructor(
    private readonly tangthuvien: TangthuvienCrawler,
    private readonly vtruyen: VtruyenCrawler,
    private readonly gateway: CrawlerGateway,
    @InjectModel(Story.name, DBNames.story1) private storyModel: Model<Story>,
    @InjectModel(Chapter.name, DBNames.story1) private chapterModel: Model<Chapter>,
    @InjectModel(Source.name, DBNames.story1) private sourceModel: Model<Source>,
    @InjectModel(Story.name, DBNames.story2) private story2Model: Model<Story>,
    @InjectModel(Chapter.name, DBNames.story2) private chapter2Model: Model<Chapter>,
    @InjectModel(Story.name, DBNames.story3) private story3Model: Model<Story>,
    @InjectModel(Chapter.name, DBNames.story3) private chapter3Model: Model<Chapter>,
    @InjectModel(Story.name, DBNames.story4) private story4Model: Model<Story>,
    @InjectModel(Chapter.name, DBNames.story4) private chapter4Model: Model<Chapter>,
  ) {}

  private getAdapter(source: string): ICrawlerAdapter {
    switch (source?.toLowerCase()) {
      case 'tangthuvien':
        return this.tangthuvien;
      case 'vtruyen':
        return this.vtruyen;
      default:
        return this.tangthuvien;
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
        if (getLimitConfig().ON && getLimitConfig().DEMO_STORIES_NUMBER > 0) {
          if (Number(storyIndex) >= getLimitConfig().DEMO_STORIES_NUMBER) {
            this.logData(
              `Reached demo limit of ${getLimitConfig().DEMO_STORIES_NUMBER} stories, skipping further crawls.`,
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

      // After crawling all stories, we can crawl chapters
      await this.crawlAllChapters(source._id.toString());

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
        try {
          await adapter.getListChapters(story);
        } catch (error) {
          this.logData(
            `Retrying to crawl chapters for story: ${story.title} due to error: ${error.message}`,
            source,
          );
          try {
            await adapter.getListChapters(story);
          } catch (error) {
            this.logData(
              `Failed on retrying to crawl chapters for story: ${story.title} with title ${error.message}`,
              source,
            );
          } finally {
            continue;
          }
        }
        this.logData(`Completed crawling for story: ${story.title}`, source);
      }

      this.logData(`Starting crawl chapters content`, source);

      await this.crawlChapterContent(source._id.toString());
    } catch (error) {
      this.logData(`Error during crawl: ${error.message}`, source);
    } finally {
      this.activeCrawlMap.delete(source._id.toString());
    }
  }

  async crawlChapterContent(sourceId: string) {
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

      const allCrawledStories = await this.storyModel.find({
        source: source._id,
        isDetailCrawled: true,
        isChapterCrawled: true,
      });

      for (const story of allCrawledStories) {
        this.logData(
          `Crawling content for chapter of story: ${story.title}`,
          source,
        );

        try {
            const chapters = await this.chapterModel.find({
            content: { $exists: false },
            story: story._id,
            }).sort({ chapterNumber: 1 });

          this.logData(
            `Found ${chapters.length} chapters to crawl content of ${story.title}.`,
            source,
          );

          for (const chapter of chapters) {
            try {
              this.logData(
                `Crawling content of chapter: ${chapter.title}`,
                source,
              );
              await adapter.getChapterContent(chapter);
              // await sleep(300);
            } catch (error) {
              this.logData(
                `[[Skipped]] chapter by error ${chapter.title}: ${error.message}`,
                source,
              );
            }
            this.logData(
              `Crawled content for chapter: ${chapter.title}`,
              source,
            );
          }
        } catch (error) {
          this.logData(
            `Error crawling chapters for story ${story.title}: ${error.message}`,
            source,
          );
          continue;
        }
      }
      this.logData(`Completed crawling chapters content`, source);
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

    let source: any = story.source;
    if (typeof source === 'string') {
      source = await this.sourceModel.findOne({ _id: source});
    }

    if (!source) {
      this.logger.error(`Source for story ${story.title} not found.`);
      return;
    }

    this.logData(`Starting crawl for story: ${story.title}`, source);

    try {
      const adapter = this.getAdapter(source.name);
      if (!story.isDetailCrawled) {
        await adapter.getStoryDetail(story);
        this.logData(`Crawled story details for: ${story.title}`, source);
      }

      if (!story.isChapterCrawled) {
        this.logData(`Crawling chapter list of: ${story.title}`, source);
        await adapter.getListChapters(story);
        this.logData(`Crawled chapter list for story: ${story.title}`, source);
      }

      const chapters = await this.chapterModel.find({
        story: story._id,
        content: { $exists: false },
      });

      for (const chapter of chapters) {
        if (chapter.content) continue; // Skip if content already exists

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
    // const logMessage = `[${timestamp}] ${message}\n`;

    this.logger.log(message);
    this.gateway.sendCrawlInfo(typeof source === 'string' ? source : source._id?.toString(), message);

    // const logDir = path.join(__dirname, '..', '..', 'logs');

    // Tạo thư mục logs nếu chưa tồn tại
    // if (!fs.existsSync(logDir)) {
    //   fs.mkdirSync(logDir, { recursive: true });
    // }

    // Tạo tên file log dựa trên tên nguồn
    // const logFile = path.join(logDir, `${source.name.replace(/\s+/g, '_')}.md`);

    // Ghi log vào file .md
    // fs.appendFileSync(logFile, logMessage);
  }
}
