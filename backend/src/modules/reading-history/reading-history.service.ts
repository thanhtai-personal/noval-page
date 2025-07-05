import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ReadingHistory } from '@/schemas/readingHistory.schema';
import { Story } from '@/schemas/story.schema';
import { DBNames } from '@/utils/database';

@Injectable()
export class ReadingHistoryService {
  constructor(
    @InjectModel(ReadingHistory.name, DBNames.ums)
    private historyModel: Model<ReadingHistory>,
    @InjectModel(Story.name, DBNames.story1)
    private story1Model: Model<Story>,
    @InjectModel(Story.name, DBNames.story2)
    private story2Model: Model<Story>,
    @InjectModel(Story.name, DBNames.story3)
    private story3Model: Model<Story>,
    @InjectModel(Story.name, DBNames.story4)
    private story4Model: Model<Story>,
    @InjectModel(Story.name, DBNames.story5)
    private story5Model: Model<Story>,
  ) {}

  private getStoryModelList() {
    return [
      this.story1Model,
      this.story2Model,
      this.story3Model,
      this.story4Model,
      this.story5Model,
    ];
  }

  private async findStoryBySlug(slug: string) {
    for (const model of this.getStoryModelList()) {
      const story = await model.findOne({ slug }).select('_id');
      if (story) return story;
    }
    return null;
  }

  async getHistory(userId: string) {
    return this.historyModel
      .find({ user: userId })
      .populate('story', 'title slug cover')
      .sort({ updatedAt: -1 });
  }

  async syncHistory(
    userId: string,
    items: { storySlug: string; chapter: number }[],
  ) {
    for (const item of items) {
      const story = await this.findStoryBySlug(item.storySlug);
      if (!story) continue;
      await this.historyModel.updateOne(
        { user: userId, story: story._id },
        { chapter: item.chapter, updatedAt: new Date() },
        { upsert: true },
      );
    }
  }
}
