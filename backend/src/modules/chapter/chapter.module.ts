import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Chapter, ChapterSchema } from '@/schemas/chapter.schema';
import { ChapterController } from './chapter.controller';
import { ChapterService } from './chapter.service';
import { User, UserSchema } from "@/schemas/user.schema";
import { DBNames, DB_STORIES_NAMES } from "@/utils/dbConfig";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
    ], DBNames.ums),
    ...DB_STORIES_NAMES.map((name) =>
      MongooseModule.forFeature([{ name: Chapter.name, schema: ChapterSchema }], name))
  ],
  controllers: [ChapterController],
  providers: [ChapterService],
  exports: [ChapterService],
})
export class ChapterModule { }
