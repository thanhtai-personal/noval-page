// src/modules/crawler/crawler.scheduler.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CrawlerService } from './crawler.service';

@Injectable()
export class CrawlerScheduler {
  private readonly logger = new Logger(CrawlerScheduler.name);

  constructor(private readonly crawlerService: CrawlerService) {}

  // 🕛 Tự động chạy mỗi ngày lúc 00:00
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleMidnightCrawl() {
    this.logger.log('🌙 Cronjob 00:00: Bắt đầu crawl toàn bộ các site...');

    const sites = ['tangthuvien', 'vtruyen'];

    for (const site of sites) {
      try {
        this.logger.log(`🚀 Crawl site: ${site}`);
        await this.crawlerService.startCrawlSite(site);
      } catch (err) {
        this.logger.error(`❌ Lỗi khi crawl site ${site}: ${err.message}`);
      }
    }

    this.logger.log('✅ Cronjob crawl kết thúc');
  }
}
