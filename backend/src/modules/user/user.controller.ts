import { Controller, Get, Post, Body } from '@nestjs/common';
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
  @Post()
  createUser(@Body() dto: CreateUserDto) {
    return this.userService.createUser(dto);
  }
}
