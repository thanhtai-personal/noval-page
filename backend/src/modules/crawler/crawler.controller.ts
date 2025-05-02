import { Controller, Post, Body } from '@nestjs/common';
import { CrawlerService } from './crawler.service';

@Controller('crawler')
export class CrawlerController {
  constructor(private readonly crawlerService: CrawlerService) {}

  @Post('crawl')
  async crawl(@Body() body: { url: string; source: string }) {
    return this.crawlerService.crawlAndSave(body.url, body.source);
  }
}
