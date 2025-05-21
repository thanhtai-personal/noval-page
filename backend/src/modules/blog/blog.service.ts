import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog } from '@/schemas/blog.schema';
import { Model } from 'mongoose';

@Injectable()
export class BlogService {
  constructor(@InjectModel(Blog.name) private blogModel: Model<Blog>) {}

  async getBlogs(page = 1, limit = 10, sort = 'views') {
    const total = await this.blogModel.countDocuments();
    const data = await this.blogModel
      .find()
      .sort({ [sort]: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return { total, page, limit, data };
  }
}
