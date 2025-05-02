import { Controller, Get, Param, Query, NotFoundException, Post, Body } from '@nestjs/common';
import { StoryService } from './story.service';
import { GetStoryListDto } from './dto/get-story-list.dto';
import { Public } from "../auth/decorators/public.decorator";
import { Roles } from "../auth/decorators/roles.decorator";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { CreateStoryDto } from "./dto/create-story.dto";

@Controller('stories')
export class StoryController {
  constructor(private readonly storyService: StoryService) {}

  @Public()
  @Get()
  getStories(@Query() query: GetStoryListDto) {
    return this.storyService.getStories(query);
  }

  @Public()
  @Get(':slug')
  async getStoryDetail(@Param('slug') slug: string) {
    const story = await this.storyService.getStoryDetail(slug);
    if (!story) throw new NotFoundException('Truyện không tồn tại');
    return story;
  }

  @Roles('admin')
  @Post()
  createStory(
    @Body() dto: CreateStoryDto,
    @CurrentUser('userId') userId: string,
  ) {
    return this.storyService.createStory(dto, userId);
  }
}
