import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ReadingHistory,
  ReadingHistorySchema,
} from '@/schemas/readingHistory.schema';
import { Story, StorySchema } from '@/schemas/story.schema';
import { ReadingHistoryService } from './reading-history.service';
import { ReadingHistoryController } from './reading-history.controller';
import { DBNames } from '@/utils/database';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: ReadingHistory.name, schema: ReadingHistorySchema }],
      DBNames.ums,
    ),
    MongooseModule.forFeature(
      [{ name: Story.name, schema: StorySchema }],
      DBNames.story1,
    ),
    MongooseModule.forFeature(
      [{ name: Story.name, schema: StorySchema }],
      DBNames.story2,
    ),
    MongooseModule.forFeature(
      [{ name: Story.name, schema: StorySchema }],
      DBNames.story3,
    ),
    MongooseModule.forFeature(
      [{ name: Story.name, schema: StorySchema }],
      DBNames.story4,
    ),
    MongooseModule.forFeature(
      [{ name: Story.name, schema: StorySchema }],
      DBNames.story5,
    ),
  ],
  providers: [ReadingHistoryService],
  controllers: [ReadingHistoryController],
})
export class ReadingHistoryModule {}
