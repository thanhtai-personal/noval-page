import { Controller, Get } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { Public } from "../auth/decorators/public.decorator";

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Public()
  @Get()
  async getAll() {
    return await this.categoryService.getAll();
  }
}
