import { Controller, Get, Query } from '@nestjs/common';
import { BlogService } from './blog.service';

@Controller('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get()
  async findAll(@Query() query: any) {
    const { page, limit, sort } = query;
    return await this.blogService.getBlogs(Number(page), Number(limit), sort);
  }
}
