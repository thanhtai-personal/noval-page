// src/modules/crawler/sites/interfaces/crawler-adapter.interface.ts

import { Chapter } from "@/schemas/chapter.schema";
import { Story } from "@/schemas/story.schema";

export interface ICrawlerAdapter {
  getAllStoryOverview(): Promise<void>;
  getListChapters(story: Story): Promise<void>;
  getChapterContent(chapter: Chapter): Promise<void>;
  getStoryDetail(story: Story, reUpdate?: boolean): Promise<void>;
}
export interface ICrawlerAdapterConstructor {
  new (...args: any[]): ICrawlerAdapter;
}
export interface ICrawlerAdapterConfig {
  sourceName: string;
  sourceUrl: string;
  sourceId: string;
  sourceLogo?: string;
  sourceDescription?: string;
  sourceType?: string;
  sourceCategory?: string;
  sourceTags?: string[];
}
export interface ICrawlerAdapterConfigWithModel extends ICrawlerAdapterConfig {
  sourceModel: any;
  storyModel: any;
  chapterModel: any;
  authorModel: any;
  categoryModel: any;
  tagModel: any;
}
