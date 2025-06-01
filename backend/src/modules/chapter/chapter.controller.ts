import { Body, Controller, Get, Param, Query } from '@nestjs/common';
import { ChapterService } from './chapter.service';
import { GetChapterListDto } from './dto/get-chapter-list.dto';
import { Public } from "../auth/decorators/public.decorator";

@Controller('stories/:slug/chapters')
export class ChapterController {
  constructor(private readonly chapterService: ChapterService) {}

  @Public()
  @Get()
  async getChapterList(
    @Param('slug') slug: string,
    @Query() query: GetChapterListDto,
  ) {
    const chaptersResponse = await this.chapterService.getChapterList(slug, query);
    return chaptersResponse;
  }

  @Public()
  @Get(':chapterSlug')
  async getChapterDetail(
    @Param('slug') slug: string,
    @Param('chapterSlug') chapterSlug: string,
  ) {
    const chaptersResponse =  await this.chapterService.getChapterDetail(slug, chapterSlug);
    return chaptersResponse;
  }

  @Public()
  @Get('prev-and-next/:chapterNumber')
  async getNextAndPrev(
    @Param('slug') slug: string,
    @Param('chapterNumber') chapterNumber: number,
  ) {
    const chaptersResponse =  await this.chapterService.getPrevAndNext(slug, chapterNumber);
    return chaptersResponse;
  }
}
