// src/modules/crawler/crawler.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CrawlerController } from './crawler.controller';
import { CrawlerService } from './crawler.service';
import { CrawlerScheduler } from './crawler.scheduler';

import { TangthuvienCrawler } from './sites/tangthuvien/tangthuvien.crawler';
import { VtruyenCrawler } from './sites/vtruyen.crawler';

import { Story, StorySchema } from '@/schemas/story.schema';
import { Chapter, ChapterSchema } from '@/schemas/chapter.schema';
import { Author, AuthorSchema } from '@/schemas/author.schema';
import { Category, CategorySchema } from '@/schemas/category.schema';
import { Tag, TagSchema } from '@/schemas/tag.schema';
import { Source, SourceSchema } from "@/schemas/source.schema";
import { CrawlerGateway } from "./crawler.gateway";
import { CrawlHistory, CrawlHistorySchema } from '@/schemas/crawlHistory.schema';
import { DBNames } from "@/utils/database";
import { User, UserSchema } from "@/schemas/user.schema";
import { Role, RoleSchema } from "@/schemas/role.schema";
import { ChapterContent, ChapterContentSchema } from "@/schemas/chapterContent.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Role.name, schema: RoleSchema },
    ], DBNames.ums),
    MongooseModule.forFeature([
      { name: Story.name, schema: StorySchema },
      { name: Chapter.name, schema: ChapterSchema },
      { name: Author.name, schema: AuthorSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Tag.name, schema: TagSchema },
      { name: Source.name, schema: SourceSchema },
      { name: CrawlHistory.name, schema: CrawlHistorySchema },
      { name: ChapterContent.name, schema: ChapterContentSchema },
    ], DBNames.story1),
    MongooseModule.forFeature([
      { name: Story.name, schema: StorySchema },
      { name: Chapter.name, schema: ChapterSchema },
      { name: Author.name, schema: AuthorSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Tag.name, schema: TagSchema },
      { name: Source.name, schema: SourceSchema },
      { name: CrawlHistory.name, schema: CrawlHistorySchema },
      { name: ChapterContent.name, schema: ChapterContentSchema },
    ], DBNames.story2),
    MongooseModule.forFeature([
      { name: Story.name, schema: StorySchema },
      { name: Chapter.name, schema: ChapterSchema },
      { name: Author.name, schema: AuthorSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Tag.name, schema: TagSchema },
      { name: Source.name, schema: SourceSchema },
      { name: CrawlHistory.name, schema: CrawlHistorySchema },
      { name: ChapterContent.name, schema: ChapterContentSchema },
    ], DBNames.story3),
    MongooseModule.forFeature([
      { name: Story.name, schema: StorySchema },
      { name: Chapter.name, schema: ChapterSchema },
      { name: Author.name, schema: AuthorSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Tag.name, schema: TagSchema },
      { name: Source.name, schema: SourceSchema },
      { name: CrawlHistory.name, schema: CrawlHistorySchema },
      { name: ChapterContent.name, schema: ChapterContentSchema },
    ], DBNames.story4),
    MongooseModule.forFeature([
      { name: Story.name, schema: StorySchema },
      { name: Chapter.name, schema: ChapterSchema },
      { name: Author.name, schema: AuthorSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Tag.name, schema: TagSchema },
      { name: Source.name, schema: SourceSchema },
      { name: CrawlHistory.name, schema: CrawlHistorySchema },
      { name: ChapterContent.name, schema: ChapterContentSchema },
    ], DBNames.story5),
  ],
  controllers: [CrawlerController],
  providers: [
    CrawlerService,
    CrawlerScheduler,
    TangthuvienCrawler,
    VtruyenCrawler,
    CrawlerGateway
  ],
})
export class CrawlerModule {}
