import { Controller, Post, Body } from '@nestjs/common';
import { CrawlerService } from './crawler.service';
import { RoleSlug } from "@/constants/role.enum";
import { Roles } from "../auth/decorators/roles.decorator";

@Controller('crawler')
export class CrawlerController {
  constructor(private readonly crawlerService: CrawlerService) {}

  @Roles(RoleSlug.SUPER_ADMIN, RoleSlug.ADMIN)
  @Post('crawl')
  async crawl(@Body() body: { url: string; source: string }) {
    return this.crawlerService.crawlAndSave(body.url, body.source);
  }
}
