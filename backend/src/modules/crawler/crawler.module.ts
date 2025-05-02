import { Module } from '@nestjs/common';
import { CrawlerController } from './crawler.controller';
import { CrawlerService } from './crawler.service';
import { TangthuvienCrawler } from './sites/tangthuvien.crawler';
import { VtruyenCrawler } from './sites/vtruyen.crawler';
import { Author, AuthorSchema } from "@/schemas/author.schema";
import { Chapter, ChapterSchema } from "@/schemas/chapter.schema";
import { Story, StorySchema } from "@/schemas/story.schema";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Story.name, schema: StorySchema },
      { name: Chapter.name, schema: ChapterSchema },
      { name: Author.name, schema: AuthorSchema },
    ]),
  ],
  controllers: [CrawlerController],
  providers: [CrawlerService, TangthuvienCrawler, VtruyenCrawler],
})
export class CrawlerModule {}
