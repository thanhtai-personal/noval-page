import { Controller, Get, Param, Query } from '@nestjs/common';
import { ChapterService } from './chapter.service';
import { GetChapterListDto } from './dto/get-chapter-list.dto';

@Controller('stories/:slug/chapters')
export class ChapterController {
  constructor(private readonly chapterService: ChapterService) {}

  @Get()
  async getChapterList(
    @Param('slug') slug: string,
    @Query() query: GetChapterListDto,
  ) {
    return this.chapterService.getChapterList(slug, query);
  }

  @Get(':chapterSlug')
  async getChapterDetail(
    @Param('slug') slug: string,
    @Param('chapterSlug') chapterSlug: string,
  ) {
    return this.chapterService.getChapterDetail(slug, chapterSlug);
  }
}
