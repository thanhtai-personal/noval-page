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
    return this.crawlerService.crawlStoryById(storyId);
  }

  /**
   * API: Bắt đầu crawl toàn bộ site
   */
  @Roles(RoleSlug.SUPER_ADMIN)
  @Post('site/start')
  async startSiteCrawl(@Body() body: { source: string }) {
    return this.crawlerService.startCrawlSite(body.source);
  }

  /**
   * API: Hủy crawl site đang chạy
   */
  @Roles(RoleSlug.SUPER_ADMIN)
  @Post('site/cancel')
  async cancelSiteCrawl(@Body() body: { source: string }) {
    return this.crawlerService.cancelCrawlSite(body.source);
  }
}
