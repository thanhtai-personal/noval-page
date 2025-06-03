import { Controller, Post, Body, Param } from '@nestjs/common';
import { CrawlerService } from './crawler.service';
import { Roles } from '@/modules/auth/decorators/roles.decorator';
import { RoleSlug } from '@/constants/role.enum';

@Controller('crawler')
export class CrawlerController {
  constructor(private readonly crawlerService: CrawlerService) {}

  /**
   * API: Crawl & lưu 1 truyện cụ thể theo URL
   */
  @Roles(RoleSlug.SUPER_ADMIN, RoleSlug.ADMIN)
  @Post('crawl')
  async crawlByUrl(@Body() body: { url: string }) {
    return this.crawlerService.startCrawlSite(body.url);
  }

  /**
   * API: Crawl chương mới cho 1 truyện theo ID
   */
  @Roles(RoleSlug.SUPER_ADMIN, RoleSlug.ADMIN)
  @Post('story/:id')
  async crawlStoryById(@Param('id') storyId: string) {
    this.crawlerService.crawlStoryById(storyId);
    return { message: `Crawl started for story ID: ${storyId}` };
  }

  /**
   * API: Bắt đầu crawl toàn bộ site
   */
  @Roles(RoleSlug.SUPER_ADMIN, RoleSlug.ADMIN)
  @Post('site/start')
  async startSiteCrawl(@Body() body: { source: string }) {
    this.crawlerService.startCrawlSite(body.source);
    return { message: `Crawl started for source: ${body.source}` };
  }

  /**
   * API: Bắt đầu crawl toàn bộ site
   */
  @Roles(RoleSlug.SUPER_ADMIN, RoleSlug.ADMIN)
  @Post('source/:id/crawl-chapters')
  async continueCrawlChapters(@Param('id') id: string) {
    this.crawlerService.crawlAllChapters(id);
    return { message: `Crawl chapters started for source: ${id}` };
  }

  @Roles(RoleSlug.SUPER_ADMIN, RoleSlug.ADMIN)
  @Post('source/:id/crawl')
  async startSourceCrawl(@Param('id') id: string) {
    this.crawlerService.startCrawlSite(id);
    return { message: `Crawl started for source ID: ${id}` };
  }
}
