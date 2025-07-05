import { Tag } from '@/schemas/tag.schema';
import { DBNames } from '@/utils/database';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class TagService {
  constructor(
    @InjectModel(Tag.name, DBNames.story1) private model: Model<Tag>,
  ) {}

  async getAll() {
    return this.model.find().select('-__v');
  }
}
