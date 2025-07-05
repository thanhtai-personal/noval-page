import { Controller, Get } from '@nestjs/common';
import { TagService } from './tag.service';
import { Public } from '../auth/decorators/public.decorator';

@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  @Public()
  async getAll() {
    return await this.tagService.getAll();
  }
}
