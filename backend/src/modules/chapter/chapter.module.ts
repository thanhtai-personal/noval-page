import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Chapter, ChapterSchema } from '@/schemas/chapter.schema';
import { Story, StorySchema } from '@/schemas/story.schema';
import { ChapterController } from './chapter.controller';
import { ChapterService } from './chapter.service';
import { User, UserSchema } from "@/schemas/user.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Chapter.name, schema: ChapterSchema },
      { name: Story.name, schema: StorySchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [ChapterController],
  providers: [ChapterService],
})
export class ChapterModule {}
