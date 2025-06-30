import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Chapter } from '@/schemas/chapter.schema';
import { Story } from '@/schemas/story.schema';
import { Model } from 'mongoose';
import { GetChapterListDto } from './dto/get-chapter-list.dto';
import { User } from "@/schemas/user.schema";
import { DBNames, getExpForNextLevel } from "@/utils/database";

@Injectable()
export class ChapterService {
  constructor(
    @InjectModel(Story.name, DBNames.story1) private storyModel: Model<Story>,
    @InjectModel(Chapter.name, DBNames.story2) private chapter2Model: Model<Chapter>,
    @InjectModel(Chapter.name, DBNames.story3) private chapter3Model: Model<Chapter>,
    @InjectModel(Chapter.name, DBNames.story4) private chapter4Model: Model<Chapter>,
    @InjectModel(User.name, DBNames.ums) private userModel: Model<User>
  ) { }

  async getChapterList(slug: string, query: GetChapterListDto) {
    const { page = 1, limit = 50 } = query;
    const story = await this.storyModel.findOne({ slug }).select('_id');
    if (!story) return { total: 0, page, limit, data: [] };

    const filter = { story: story._id };
    let chapterModel = this.chapter2Model;
    let total = await chapterModel.countDocuments(filter);
    if (total === 0) {
      chapterModel = this.chapter3Model;
      total = await chapterModel.countDocuments(filter);

      if (total === 0) {
        chapterModel = this.chapter4Model;
        total = await chapterModel.countDocuments(filter);
      }
    }

    const data = await chapterModel
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

    let chapterModel = this.chapter2Model;
    let total = await chapterModel.countDocuments({
      story: story._id
    });
    if (total === 0) {
      chapterModel = this.chapter3Model;
      total = await chapterModel.countDocuments({
        story: story._id
      });

      if (total === 0) {
        chapterModel = this.chapter4Model;
        total = await chapterModel.countDocuments({
          story: story._id
        });
      }
    }


    const prev = await chapterModel.findOne({
      story: story._id,
      chapterNumber: Number(chapterNumber) - 1,
    });

    const next = await chapterModel.findOne({
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

    let chapterDetail = await this.chapter2Model.findOne({
      story: story._id,
      slug: chapterSlug,
    });

    if (!chapterDetail) {
      chapterDetail = await this.chapter3Model.findOne({
        story: story._id,
        slug: chapterSlug,
      });

      if (!chapterDetail) {
        chapterDetail = await this.chapter4Model.findOne({
          story: story._id,
          slug: chapterSlug,
        });
      }
    }

    return chapterDetail;

  }

  async markAsRead(slug, chapterSlug, userId) {
    try {
      const story = await this.storyModel.findOne({ slug });
      if (!story) return null;

      let chapter = await this.chapter2Model.findOne({
        story: story._id,
        slug: chapterSlug,
      });

      if (!chapter) {
        chapter = await this.chapter3Model.findOne({
          story: story._id,
          slug: chapterSlug,
        });

        if (!chapter) {
          chapter = await this.chapter4Model.findOne({
            story: story._id,
            slug: chapterSlug,
          });
        }
      }

      const user = await this.userModel.findById(userId);
      const newExp = (user?.exp || 0) + (chapter?.expValue || 1);

      const dataUpdate = { exp: newExp, levelNumber: user?.levelNumber || 0 }
      if (newExp >= getExpForNextLevel(user?.levelNumber || 0)) {
        dataUpdate.levelNumber = dataUpdate.levelNumber + 1
      }

      await this.userModel.findByIdAndUpdate(userId, dataUpdate);
      await this.storyModel.findByIdAndUpdate(story?._id, {
        views: Number(story?.views || '0') + 1
      });
    } catch (error) { }
  }

  async updateChapter(slug, chapterSlug, data: any) {
    try {
      await this.chapter2Model.findOneAndUpdate(
        { slug: chapterSlug },
        data,
        { new: false }
      )
      await this.chapter3Model.findOneAndUpdate(
        { slug: chapterSlug },
        data,
        { new: false }
      )
      await this.chapter4Model.findOneAndUpdate(
        { slug: chapterSlug },
        data,
        { new: false }
      )
    } catch (error) { }
  }
}
