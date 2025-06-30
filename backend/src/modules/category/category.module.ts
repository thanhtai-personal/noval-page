import { Category, CategorySchema } from "@/schemas/category.schema";
import { MongooseModule } from "@nestjs/mongoose";
import { CategoryController } from "./category.controller";
import { CategoryService } from "./category.service";
import { Module } from '@nestjs/common';
import { DBNames } from "@/utils/database";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }], DBNames.story1),
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
