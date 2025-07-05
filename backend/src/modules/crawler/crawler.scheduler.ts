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
    this.logger.log(
      '🌙 Cronjob 00:00: Bắt đầu crawl truyện mới hoặc chưa hoàn tất...',
    );

    const sources = ['tangthuvien', 'vtruyen'];

    for (const source of sources) {
      try {
        this.logger.log(`🚀 Đang xử lý nguồn: ${source}`);
        await this.crawlerService.crawlNewStoriesOnly(source);
      } catch (err) {
        this.logger.error(`❌ Lỗi khi crawl ${source}: ${err.message}`);
      }
    }

    this.logger.log('✅ Cronjob crawl truyện mới hoàn tất.');
  }
}
