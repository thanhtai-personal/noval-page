import { Category } from "@/schemas/category.schema";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class CategoryService {
  constructor(@InjectModel(Category.name) private model: Model<Category>) {}

  async getAll() {
    return this.model.find().select('-__v');
  }
}
