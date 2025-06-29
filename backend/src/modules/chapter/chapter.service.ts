import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Chapter } from '@/schemas/chapter.schema';
import { Story } from '@/schemas/story.schema';
import { Model } from 'mongoose';
import { GetChapterListDto } from './dto/get-chapter-list.dto';
import { User } from "@/schemas/user.schema";
import { DBNames } from "@/utils/dbConfig";
import { StoryService } from "../story/story.service";

@Injectable()
export class ChapterService {
  constructor(
  
      @InjectModel(Story.name, DBNames.story1) private storyService: StoryService,
  
      @InjectModel(Chapter.name, DBNames.story1) private chapterModelDB1: Model<Chapter>,
      @InjectModel(Chapter.name, DBNames.story2) private chapterModelDB2: Model<Chapter>,
      @InjectModel(Chapter.name, DBNames.story3) private chapterModelDB3: Model<Chapter>,
  
      @InjectModel(User.name, DBNames.ums) private userModel: Model<User>,
  ) { }

  async getChapterList(slug: string, query: GetChapterListDto) {
    const { page = 1, limit = 50 } = query;
    const story = await this.storyService.getOne(slug);
    if (!story) return { total: 0, page, limit, data: [] };

    const filter = { story: story._id };
    const total = await this.chapterModelDB1.countDocuments(filter);
    const data = await this.chapterModelDB1
      .find(filter)
      .sort({ chapterNumber: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select('title slug chapterNumber')
      .lean();

    return {
      total,
      page,
      limit,
      data,
    };
  }

  async getPrevAndNext(storySlug: string, chapterNumber: number) {
    const story = await this.storyService.getOne(storySlug);
    if (!story) return null;

    const prev = await this.chapterModelDB1.findOne({
      story: story._id,
      chapterNumber: Number(chapterNumber) - 1,
    });

    const next = await this.chapterModelDB1.findOne({
      story: story._id,
      chapterNumber: Number(chapterNumber) + 1,
    });

    return {
      prev,
      next,
    };
  }

  async getChapterDetail(storySlug: string, chapterSlug: string) {
    const story = await this.storyService.getOne(storySlug);;
    if (!story) return null;

    return this.chapterModelDB1.findOne({
      story: story._id,
      slug: chapterSlug,
    });
  }

  async markAsRead(slug, chapterSlug, userId) {
    try {
      const story = await this.storyService.getOne(slug);;
      const chapter = await this.chapterModelDB1.findOne({ slug: chapterSlug });
      const user = await this.userModel.findById(userId);
      const newExp = (user?.exp || 0) + (chapter?.expValue || 1);

      const dataUpdate = { exp: newExp }
      // if (newExp >= getExpForNextLevel(user.level)) {
      //  dataUpdate.level = dataUpdate.level + 1
      // }

      await this.userModel.findByIdAndUpdate(userId, dataUpdate);
      await this.storyService.findByIdAndUpdate(story?._id as string, {
        views: Number(story?.views || '0') + 1
      });
    } catch (error) {}
  }

  async updateChapter(slug, chapterSlug, data: any) {
    try {
      await this.chapterModelDB1.findOneAndUpdate(
        { slug: chapterSlug },
        data
      )
    } catch (error) {}
  }
}
