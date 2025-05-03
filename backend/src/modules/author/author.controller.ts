import { Controller, Get, Param, Query, NotFoundException } from '@nestjs/common';
import { AuthorService } from './author.service';
import { GetAuthorListDto } from './dto/get-author-list.dto';
import { Public } from "../auth/decorators/public.decorator";

@Controller('authors')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Public()
  @Get()
  getAuthorList(@Query() query: GetAuthorListDto) {
    return this.authorService.getAuthorList(query);
  }
  
  @Public()
  @Get(':slug')
  async getAuthorDetail(@Param('slug') slug: string) {
    const author = await this.authorService.getAuthorDetail(slug);
    if (!author) throw new NotFoundException('Không tìm thấy tác giả');
    return author;
  }
}
