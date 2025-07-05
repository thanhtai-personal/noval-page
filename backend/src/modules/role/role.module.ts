import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from '@/schemas/role.schema';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { DBNames } from '@/utils/database';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Role.name, schema: RoleSchema }],
      DBNames.ums,
    ),
  ],
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule {}
