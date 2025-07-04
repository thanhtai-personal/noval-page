import { Body, Controller, Get, Post } from '@nestjs/common';
import { ReadingHistoryService } from './reading-history.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { RoleSlug } from '@/constants/role.enum';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { SyncReadingHistoryDto } from './dto/sync-reading-history.dto';

@Controller('reading-history')
export class ReadingHistoryController {
  constructor(private readonly service: ReadingHistoryService) {}

  @Roles(RoleSlug.READER)
  @Get()
  async getHistory(@CurrentUser('userId') userId: string) {
    return this.service.getHistory(userId);
  }

  @Roles(RoleSlug.READER)
  @Post('sync')
  async syncHistory(
    @CurrentUser('userId') userId: string,
    @Body() dto: SyncReadingHistoryDto
  ) {
    await this.service.syncHistory(userId, dto.items || []);
    return this.service.getHistory(userId);
  }
}
