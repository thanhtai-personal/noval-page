import { Controller, Get, Post, Body, Delete, Param, Patch, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Roles } from "../auth/decorators/roles.decorator";
import { RoleSlug } from "@/constants/role.enum";

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(RoleSlug.SUPER_ADMIN, RoleSlug.ADMIN)
  @Get()
  getUsers() {
    return this.userService.getUsers();
  }

  @Roles(RoleSlug.SUPER_ADMIN, RoleSlug.ADMIN)
  @Get('/search')
  findAll(
    @Query('search') search: string,
    @Query('role') role: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.userService.findAll({ search, role, page: page, limit: limit });
  }

  @Roles(RoleSlug.SUPER_ADMIN, RoleSlug.ADMIN)
  @Post()
  create(@Body() dto: any) {
    return this.userService.create(dto);
  }

  @Roles(RoleSlug.SUPER_ADMIN, RoleSlug.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: any) {
    return this.userService.update(id, dto);
  }

  @Roles(RoleSlug.SUPER_ADMIN, RoleSlug.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.delete(id);
  }

  @Roles(RoleSlug.SUPER_ADMIN, RoleSlug.ADMIN)
  @Post(':id/ban')
  ban(@Param('id') id: string) {
    return this.userService.ban(id);
  }
}
