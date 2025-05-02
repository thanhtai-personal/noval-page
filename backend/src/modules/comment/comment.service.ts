import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment } from '@/schemas/comment.schema';
import { Story } from '@/schemas/story.schema';
import { Model } from 'mongoose';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    @InjectModel(Story.name) private storyModel: Model<Story>,
  ) {}

  async getCommentsByStorySlug(slug: string) {
    const story = await this.storyModel.findOne({ slug }).select('_id');
    if (!story) return [];

    return this.commentModel
      .find({ story: story._id })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
  }

  async createComment(slug: string, dto: CreateCommentDto) {
    const story = await this.storyModel.findOne({ slug }).select('_id');
    if (!story) throw new Error('Truyện không tồn tại');

    return this.commentModel.create({
      content: dto.content,
      user: dto.userId,
      story: story._id,
    });
  }
}
