// src/modules/source/source.controller.ts
import { Controller, Get, Post, Param } from '@nestjs/common';
import { SourceService } from './source.service';
import { Public } from '../auth/decorators/public.decorator';

@Controller('source')
export class SourceController {
  constructor(private readonly sourceService: SourceService) {}

  @Get()
  @Public()
  async getAll() {
    return this.sourceService.findAll();
  }

  @Post(':id/crawl')
  async startCrawl(@Param('id') id: string) {
    this.sourceService.startCrawl(id);
    return { message: 'Crawl started' };
  }

  @Post(':id/cancel')
  async cancelCrawl(@Param('id') id: string) {
    this.sourceService.cancelCrawl(id);
    return { message: 'Crawl cancelled' };
  }
}
