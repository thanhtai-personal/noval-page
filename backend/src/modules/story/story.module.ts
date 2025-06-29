import { Module } from '@nestjs/common';
import { StoryService } from './story.service';
import { StoryController } from './story.controller';
import { DB_STORIES_NAMES, DBNames } from "@/utils/dbConfig";
import { MongooseModule } from "@nestjs/mongoose";
import { Story, StorySchema } from "@/schemas/story.schema";
import { User, UserSchema } from "@/schemas/user.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
    ], DBNames.ums),
    ...DB_STORIES_NAMES.map((name) =>
      MongooseModule.forFeature([{ name: Story.name, schema: StorySchema }], name))
  ],
  controllers: [StoryController],
  providers: [StoryService],
  exports: [StoryService],
})
export class StoryModule { }
