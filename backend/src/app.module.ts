import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
// import { CrawlerModule } from './crawler/crawler.module';
import { Story, StorySchema } from './schemas/story.schema';
import { Chapter, ChapterSchema } from './schemas/chapter.schema';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/truyen'), // hoặc MongoDB Atlas URI
    MongooseModule.forFeature([
      { name: Story.name, schema: StorySchema },
      { name: Chapter.name, schema: ChapterSchema },
    ]),
    // CrawlerModule,
  ],
})
export class AppModule {}
