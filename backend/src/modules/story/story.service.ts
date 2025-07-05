import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Story } from '@/schemas/story.schema';
import { Model } from 'mongoose';
import { GetStoryListDto } from './dto/get-story-list.dto';
import { slugify } from '@/utils/slugify';
import { CreateStoryDto } from './dto/create-story.dto';
import { User } from '@/schemas/user.schema';
import { DBNames, getExpForNextLevel } from '@/utils/database';

@Injectable()
export class StoryService {
  constructor(
    @InjectModel(Story.name, DBNames.story1) private storyModel: Model<Story>,
    @InjectModel(User.name, DBNames.ums) private userModel: Model<User>,
  ) {}

  async getStories(query: GetStoryListDto) {
    const {
      page = 1,
      limit = 20,
      keyword,
      tag,
      categories,
      author,
      chapterRange,
      sort,
    } = query;

    const filter: any = {};

    // Tìm theo tiêu đề hoặc tên tác giả
    if (keyword) {
      filter.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { 'author.name': { $regex: keyword, $options: 'i' } },
      ];
    }

    // Tag
    if (tag) {
      const tagList = Array.isArray(tag) ? tag : [tag];
      filter.tags = { $in: tagList };
    }

    // Category: list tên
    if (categories) {
      const categoryList = Array.isArray(categories)
        ? categories
        : [categories];
      filter['categories.name'] = { $in: categoryList };
    }

    // Author
    if (author) {
      filter.author = author;
    }

    // Range chương
    if (chapterRange) {
      const [min, max] =
        chapterRange === '1000+'
          ? [1000, null]
          : chapterRange.split('-').map(Number);

      filter.totalChapters = max ? { $gte: min, $lte: max } : { $gte: min };
    }

    // Sort
    let sortBy: any = { updatedAt: -1 };
    if (sort) {
      sortBy = { [sort]: -1 };
    }

    const total = await this.storyModel.countDocuments(filter);

    const data = await this.storyModel
      .find(filter)
      .sort(sortBy)
      .skip((page - 1) * limit)
      .limit(limit)
      .select('-__v')
      .populate('author', 'name slug')
      .populate('tags', 'name slug')
      .populate('categories', 'name slug name')
      .lean();

    return {
      total,
      page,
      limit,
      data,
    };
  }

  async getStoryDetail(slug: string) {
    return await this.storyModel
      .findOne({ slug })
      .populate('author', 'name slug')
      .populate('tags', 'name slug')
      .populate('categories', 'name slug');
  }

  async createStory(dto: CreateStoryDto, userId: string) {
    try {
      const slug = slugify(dto.title, { lower: true });

      return await this.storyModel.create({
        title: dto.title,
        description: dto.description,
        slug,
        author: dto.authorId,
        createdBy: userId,
      });
    } catch (error) {}
  }

  async markAsRead(slug, userId) {
    try {
      const story = await this.storyModel.findOne({ slug });
      const user = await this.userModel.findById(userId);
      const newExp = (user?.exp || 0) + (story?.expValue || 1);

      const dataUpdate = { exp: newExp, levelNumber: user?.levelNumber || 0 };
      if (newExp >= getExpForNextLevel(user?.levelNumber || 0)) {
        dataUpdate.levelNumber = dataUpdate.levelNumber + 1;
      }

      await this.userModel.findByIdAndUpdate(userId, dataUpdate);
      await this.storyModel.findByIdAndUpdate(story?._id, {
        views: Number(story?.views || '0') + 1,
      });
    } catch (error) {}
  }
}
