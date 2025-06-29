import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Author } from '@/schemas/author.schema';
import { Story } from '@/schemas/story.schema';
import { Model } from 'mongoose';
import { GetAuthorListDto } from './dto/get-author-list.dto';
import { DBNames } from "@/utils/database";

@Injectable()
export class AuthorService {
  constructor(
    @InjectModel(Author.name, DBNames.story1) private authorModel: Model<Author>,
    @InjectModel(Story.name, DBNames.story1) private storyModel: Model<Story>,
  ) {}

  async getAuthorList(query: GetAuthorListDto) {
    const { keyword, page = 1, limit = 30 } = query;
    const filter: any = {};

    if (keyword) {
      filter.name = { $regex: keyword, $options: 'i' };
    }

    const total = await this.authorModel.countDocuments(filter);
    const data = await this.authorModel
      .find(filter)
      .sort({ name: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select('-__v')
      .lean();

    return {
      total,
      page,
      limit,
      data,
    };
  }

  async getAuthorDetail(slug: string) {
    const author = await this.authorModel.findOne({ slug }).lean();
    if (!author) return null;

    const stories = await this.storyModel
      .find({ author: author._id })
      .select('title slug categories tags')
      .populate('categories', 'name slug')
      .populate('tags', 'name slug')
      .lean();

    return {
      ...author,
      stories,
    };
  }
}
