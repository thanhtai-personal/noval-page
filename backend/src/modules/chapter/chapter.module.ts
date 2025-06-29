import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Chapter, ChapterSchema } from '@/schemas/chapter.schema';
import { Story, StorySchema } from '@/schemas/story.schema';
import { ChapterController } from './chapter.controller';
import { ChapterService } from './chapter.service';
import { User, UserSchema } from "@/schemas/user.schema";
import { DBNames } from "@/utils/database";
import { Role, RoleSchema } from "@/schemas/role.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Chapter.name, schema: ChapterSchema },
      { name: Story.name, schema: StorySchema },
    ], DBNames.story1),
    MongooseModule.forFeature([
      { name: Chapter.name, schema: ChapterSchema },
      { name: Story.name, schema: StorySchema },
    ], DBNames.story2),
    MongooseModule.forFeature([
      { name: Chapter.name, schema: ChapterSchema },
      { name: Story.name, schema: StorySchema },
    ], DBNames.story3),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Role.name, schema: RoleSchema },
    ], DBNames.ums),
  ],
  controllers: [ChapterController],
  providers: [ChapterService],
})
export class ChapterModule {}
