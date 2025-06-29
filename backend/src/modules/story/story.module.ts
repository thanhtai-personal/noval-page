import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Story, StorySchema } from '@/schemas/story.schema';
import { StoryService } from './story.service';
import { StoryController } from './story.controller';
import { Chapter, ChapterSchema } from "@/schemas/chapter.schema";
import { User, UserSchema } from "@/schemas/user.schema";
import { DBNames } from "@/utils/database";
import { Role, RoleSchema } from "@/schemas/role.schema";

@Module({
  imports: [MongooseModule.forFeature([
    { name: Story.name, schema: StorySchema },
    { name: Chapter.name, schema: ChapterSchema },
  ], DBNames.story1),
  MongooseModule.forFeature([
    { name: Story.name, schema: StorySchema },
    { name: Chapter.name, schema: ChapterSchema },
  ], DBNames.story2),
  MongooseModule.forFeature([
    { name: Story.name, schema: StorySchema },
    { name: Chapter.name, schema: ChapterSchema },
  ], DBNames.story3),
  MongooseModule.forFeature([
    { name: Role.name, schema: RoleSchema },
    { name: User.name, schema: UserSchema },
  ], DBNames.ums)
  ],
  controllers: [StoryController],
  providers: [StoryService],
})
export class StoryModule { }
