import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ChapterService } from './chapter.service';
import { GetChapterListDto } from './dto/get-chapter-list.dto';
import { Public } from "../auth/decorators/public.decorator";
import { RoleSlug } from "@/constants/role.enum";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { Roles } from "../auth/decorators/roles.decorator";

@Controller('stories/:slug/chapters')
export class ChapterController {
  constructor(private readonly chapterService: ChapterService) { }

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
    const chaptersResponse = await this.chapterService.getChapterDetail(slug, chapterSlug);
    return chaptersResponse;
  }

  @Roles(RoleSlug.READER)
  @Post(':chapterSlug/mark-as-read')
  async markAsRead(
    @Param('slug') slug: string,
    @Param('chapterSlug') chapterSlug: string,
    @CurrentUser('userId') userId: string
  ) {
    await this.chapterService.markAsRead(slug, chapterSlug, userId);
    return { message: 'update success' };
  }

  @Public()
  @Get('prev-and-next/:chapterNumber')
  async getNextAndPrev(
    @Param('slug') slug: string,
    @Param('chapterNumber') chapterNumber: number,
  ) {
    const chaptersResponse = await this.chapterService.getPrevAndNext(slug, chapterNumber);
    return chaptersResponse;
  }
}
