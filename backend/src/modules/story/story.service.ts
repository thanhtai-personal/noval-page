import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Story } from '@/schemas/story.schema';
import { Model } from 'mongoose';
import { GetStoryListDto } from './dto/get-story-list.dto';
import { slugify } from '@/utils/slugify';
import { CreateStoryDto } from './dto/create-story.dto';

@Injectable()
export class StoryService {
  constructor(@InjectModel(Story.name) private storyModel: Model<Story>) {}

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
    return this.storyModel
      .findOne({ slug })
      .populate('author', 'name slug')
      .populate('tags', 'name slug')
      .populate('categories', 'name slug');
  }

  async createStory(dto: CreateStoryDto, userId: string) {
    const slug = slugify(dto.title, { lower: true });

    return this.storyModel.create({
      title: dto.title,
      description: dto.description,
      slug,
      author: dto.authorId,
      createdBy: userId,
    });
  }
}
