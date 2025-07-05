import { Injectable } from '@nestjs/common';
import { ICrawlerAdapter } from './interfaces/crawler-adapter.interface';
import { Chapter } from '@/schemas/chapter.schema';
import { Story } from '@/schemas/story.schema';
import { Model } from 'mongoose';

@Injectable()
export class VtruyenCrawler implements ICrawlerAdapter {
  getStoryDetail(story: Story): Promise<void> {
    throw new Error('Method not implemented.');
  }
  getAllStoryOverview(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  getListChapters(story: Story): Promise<void> {
    throw new Error('Method not implemented.');
  }
  getChapterContent(
    chapteModel: Model<Chapter>,
    chapter: Chapter,
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
