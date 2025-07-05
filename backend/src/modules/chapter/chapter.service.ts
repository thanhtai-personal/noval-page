import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Chapter } from '@/schemas/chapter.schema';
import { Story } from '@/schemas/story.schema';
import { Model } from 'mongoose';
import { GetChapterListDto } from './dto/get-chapter-list.dto';
import { User } from '@/schemas/user.schema';
import {
  DBNames,
  getExpForNextLevel,
  switchModelByDBLimit,
} from '@/utils/database';
import { ChapterContent } from '@/schemas/chapterContent.schema';

@Injectable()
export class ChapterService {
  constructor(
    @InjectModel(Story.name, DBNames.story1) private storyModel: Model<Story>,
    @InjectModel(User.name, DBNames.ums) private userModel: Model<User>,

    @InjectModel(Chapter.name, DBNames.story1)
    private chapter1Model: Model<Chapter>,
    @InjectModel(Chapter.name, DBNames.story2)
    private chapter2Model: Model<Chapter>,
    @InjectModel(Chapter.name, DBNames.story3)
    private chapter3Model: Model<Chapter>,
    @InjectModel(Chapter.name, DBNames.story4)
    private chapter4Model: Model<Chapter>,
    @InjectModel(Chapter.name, DBNames.story5)
    private chapter5Model: Model<Chapter>,

    @InjectModel(ChapterContent.name, DBNames.story2)
    private chapterContent2Model: Model<ChapterContent>,
    @InjectModel(ChapterContent.name, DBNames.story3)
    private chapterContent3Model: Model<ChapterContent>,
    @InjectModel(ChapterContent.name, DBNames.story4)
    private chapterContent4Model: Model<ChapterContent>,
    @InjectModel(ChapterContent.name, DBNames.story5)
    private chapterContent5Model: Model<ChapterContent>,
  ) {}

  async getChapterList(slug: string, query: GetChapterListDto) {
    const { page = 1, limit = 50, sort } = query;
    const story = await this.storyModel.findOne({ slug }).select('_id');
    if (!story) return { total: 0, page, limit, data: [] };

    const filter = { story: story._id };
    let chapterModel = this.chapter1Model;
    let total = await chapterModel.countDocuments(filter);

    const chapterModels = [
      this.chapter1Model,
      this.chapter2Model,
      this.chapter3Model,
      this.chapter4Model,
      this.chapter5Model,
    ];

    for (const cModel of chapterModels) {
      const count = await cModel.countDocuments(filter);
      if (count > 0) {
        chapterModel = cModel;
        total = count;
        break;
      }
    }

    const sortField = sort?.replace(/^-/, '') || 'chapterNumber';
    const sortOrder = sort?.startsWith('-') ? -1 : 1;
    const sortBy: any = { [sortField]: sortOrder };

    const data = await chapterModel
      .find(filter)
      .sort(sortBy)
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

    let chapterModel = this.chapter1Model;

    const chapterModels = [
      this.chapter1Model,
      this.chapter2Model,
      this.chapter3Model,
      this.chapter4Model,
      this.chapter5Model,
    ];

    for (const cModel of chapterModels) {
      const count = await cModel.countDocuments({
        story: story._id,
      });
      if (count > 0) {
        chapterModel = cModel;
        break;
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

    const chapterModels = [
      this.chapter1Model,
      this.chapter2Model,
      this.chapter3Model,
      this.chapter4Model,
      this.chapter5Model,
    ];

    for (const cModel of chapterModels) {
      const chapterDetail = await cModel.findOne({
        story: story._id,
        slug: chapterSlug,
      });
      if (chapterDetail) {
        const chapterContent = await this.getChapterContent(
          storySlug,
          chapterSlug,
        );
        return {
          ...chapterDetail,
          content: chapterContent?.content,
        };
      }
    }

    return null;
  }

  async markAsRead(slug: string, chapterSlug: string, userId: string) {
    try {
      const story = await this.storyModel.findOne({ slug }).select('_id views');
      if (!story) return null;

      // Try to find the chapter in all chapter models
      const chapterModels = [
        this.chapter1Model,
        this.chapter2Model,
        this.chapter3Model,
        this.chapter4Model,
        this.chapter5Model,
      ];
      let chapter: Chapter | null = null;
      for (const cModel of chapterModels) {
        chapter = await cModel.findOne({ story: story._id, slug: chapterSlug });
        if (chapter) break;
      }

      if (!chapter) return null;

      const user = await this.userModel
        .findById(userId)
        .select('exp levelNumber');
      if (!user) return null;

      const currentExp = user.exp || 0;
      const expValue = chapter.expValue || 1;
      let newExp = currentExp + expValue;
      let newLevel = user.levelNumber || 0;

      if (newExp >= getExpForNextLevel(newLevel)) {
        newLevel += 1;
      }

      await this.userModel.findByIdAndUpdate(userId, {
        exp: newExp,
        levelNumber: newLevel,
      });
      await this.storyModel.findByIdAndUpdate(story._id, {
        views: (story.views || 0) + 1,
      });
    } catch (error) {
      // Optionally log error
    }
  }

  async updateChapter(slug, chapterSlug, data: any) {
    try {
      const story = await this.storyModel.findOne({ slug }).select('_id');
      if (!story) return null;
      const filter = { story: story._id, slug: chapterSlug };
      const chapterModels = [
        this.chapter1Model,
        this.chapter2Model,
        this.chapter3Model,
        this.chapter4Model,
        this.chapter5Model,
      ];
      for (const cModel of chapterModels) {
        const { content, ...chapterData } = data;
        const updatedChapter = await cModel.findOneAndUpdate(
          filter,
          chapterData,
          { new: false },
        );
        if (updatedChapter) {
          const chapterContentModels = [
            this.chapterContent2Model,
            this.chapterContent3Model,
            this.chapterContent4Model,
            this.chapterContent5Model,
          ];
          let updatedChapterContent = null;
          for (const ccModel of chapterContentModels) {
            updatedChapterContent = await ccModel.findOneAndUpdate(
              { chapter: chapterSlug },
              {
                content,
              },
              { new: false },
            );
          }
          if (!updatedChapterContent) {
            const chapterContentModel = await switchModelByDBLimit(
              ...chapterContentModels,
            );
            await chapterContentModel.findOneAndUpdate(
              { chapter: chapterSlug },
              {
                content,
              },
              {
                upsert: true,
              },
            );
          }
          break;
        }
      }
    } catch (error) {}
  }

  async getChapterContent(storySlug: string, chapterSlug: string) {
    const story = await this.storyModel
      .findOne({ slug: storySlug })
      .select('_id');
    if (!story) return null;

    const chapterModels = [
      this.chapterContent2Model,
      this.chapterContent3Model,
      this.chapterContent4Model,
      this.chapterContent5Model,
    ];

    for (const ccModel of chapterModels) {
      const chapterContent = await ccModel.findOne({
        chapter: chapterSlug,
      });
      if (chapterContent) {
        return chapterContent;
      }
    }

    return null;
  }
}
