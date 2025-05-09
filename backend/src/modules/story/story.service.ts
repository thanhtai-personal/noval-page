import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Story } from '@/schemas/story.schema';
import { Model } from 'mongoose';
import { GetStoryListDto } from './dto/get-story-list.dto';
import { slugify } from "@/utils/slugify";
import { CreateStoryDto } from "./dto/create-story.dto";

@Injectable()
export class StoryService {
  constructor(
    @InjectModel(Story.name) private storyModel: Model<Story>,
  ) {}

  async getStories(query: GetStoryListDto) {
    const { page, limit, keyword, tag, category } = query;
    const filter: any = {};
  
    if (keyword) {
      filter.title = { $regex: keyword, $options: 'i' };
    }
    if (tag) {
      filter.tags = tag;
    }
    if (category) {
      filter.categories = category;
    }
  
    const total = await this.storyModel.countDocuments(filter);
    const data = await this.storyModel
      .find(filter)
      .sort({ updatedAt: -1 }) // bạn có thể dùng viewCount, createdAt,...
      .skip((page - 1) * limit)
      .limit(limit)
      .select('-__v')
      .populate('author', 'name slug')
      .populate('tags', 'name slug')
      .populate('categories', 'name slug')
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
