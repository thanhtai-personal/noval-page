import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Story, StorySchema } from '@/schemas/story.schema';
import { StoryService } from './story.service';
import { StoryController } from './story.controller';
import { Chapter, ChapterSchema } from "@/schemas/chapter.schema";
import { User, UserSchema } from "@/schemas/user.schema";

@Module({
  imports: [MongooseModule.forFeature([
    { name: Story.name, schema: StorySchema },
    { name: Chapter.name, schema: ChapterSchema },
    { name: User.name, schema: UserSchema },
  ])],
  controllers: [StoryController],
  providers: [StoryService],
})
export class StoryModule { }
