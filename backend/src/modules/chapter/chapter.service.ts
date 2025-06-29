import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Chapter } from '@/schemas/chapter.schema';
import { Story } from '@/schemas/story.schema';
import { Model } from 'mongoose';
import { GetChapterListDto } from './dto/get-chapter-list.dto';
import { User } from "@/schemas/user.schema";
import { DBNames } from "@/utils/database";

@Injectable()
export class ChapterService {
  constructor(
    @InjectModel(Chapter.name, DBNames.story1) private chapterModel: Model<Chapter>,
    @InjectModel(Story.name, DBNames.story1) private storyModel: Model<Story>,
    @InjectModel(Chapter.name, DBNames.story2) private chapter2Model: Model<Chapter>,
    @InjectModel(Story.name, DBNames.story2) private story2Model: Model<Story>,
    @InjectModel(Chapter.name, DBNames.story3) private chapter3Model: Model<Chapter>,
    @InjectModel(Story.name, DBNames.story3) private story3Model: Model<Story>,
    @InjectModel(Chapter.name, DBNames.story4) private chapter4Model: Model<Chapter>,
    @InjectModel(Story.name, DBNames.story4) private story4Model: Model<Story>,
    @InjectModel(User.name, DBNames.ums) private userModel: Model<User>
  ) { }

  async getChapterList(slug: string, query: GetChapterListDto) {
    const { page = 1, limit = 50 } = query;
    const story = await this.storyModel.findOne({ slug }).select('_id');
    if (!story) return { total: 0, page, limit, data: [] };

    const filter = { story: story._id };
    const total = await this.chapterModel.countDocuments(filter);
    const data = await this.chapterModel
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
    const story = await this.storyModel
      .findOne({ slug: storySlug })
      .select('_id');
    if (!story) return null;

    const prev = await this.chapterModel.findOne({
      story: story._id,
      chapterNumber: Number(chapterNumber) - 1,
    });

    const next = await this.chapterModel.findOne({
      story: story._id,
      chapterNumber: Number(chapterNumber) + 1,
    });

    return {
      prev,
      next,
    };
  }

  async getChapterDetail(storySlug: string, chapterSlug: string) {
    const story = await this.storyModel
      .findOne({ slug: storySlug })
      .select('_id');
    if (!story) return null;

    return this.chapterModel.findOne({
      story: story._id,
      slug: chapterSlug,
    });
  }

  async markAsRead(slug, chapterSlug, userId) {
    try {
      const story = await this.storyModel.findOne({ slug });
      const chapter = await this.chapterModel.findOne({ slug: chapterSlug });
      const user = await this.userModel.findById(userId);
      const newExp = (user?.exp || 0) + (chapter?.expValue || 1);

      const dataUpdate = { exp: newExp }
      // if (newExp >= getExpForNextLevel(user.level)) {
      //  dataUpdate.level = dataUpdate.level + 1
      // }

      await this.userModel.findByIdAndUpdate(userId, dataUpdate);
      await this.storyModel.findByIdAndUpdate(story?._id, {
        views: Number(story?.views || '0') + 1
      });
    } catch (error) {}
  }

  async updateChapter(slug, chapterSlug, data: any) {
    try {
      await this.chapterModel.findOneAndUpdate(
        { slug: chapterSlug },
        data
      )
    } catch (error) {}
  }
}
