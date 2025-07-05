import { Category } from '@/schemas/category.schema';
import { DBNames } from '@/utils/database';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name, DBNames.story1) private model: Model<Category>,
  ) {}

  async getAll() {
    return this.model.find().select('-__v');
  }
}
