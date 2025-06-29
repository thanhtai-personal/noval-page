import { Controller, Get } from '@nestjs/common';
import { LevelService } from './level.service';
import { RoleSlug } from "@/constants/role.enum";
import { Roles } from "../auth/decorators/roles.decorator";

@Controller('levels')
export class LevelController {
  constructor(private readonly levelService: LevelService) {}

  @Get()
  @Roles(RoleSlug.SUPER_ADMIN, RoleSlug.ADMIN)
  async getLevel() {
    return {};
  }
}
