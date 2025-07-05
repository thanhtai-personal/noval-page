import { Controller, Get } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleSlug } from '@/constants/role.enum';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  @Roles(RoleSlug.SUPER_ADMIN, RoleSlug.ADMIN)
  async getRoles() {
    const roleRS = await this.roleService.getRoles();
    return roleRS;
  }
}
