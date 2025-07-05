import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@/schemas/user.schema';
import { Role, RoleSchema } from '@/schemas/role.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Level, LevelSchema } from '@/schemas/level.schema';
import { DBNames } from '@/utils/database';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: User.name, schema: UserSchema },
        { name: Role.name, schema: RoleSchema },
        { name: Level.name, schema: LevelSchema },
      ],
      DBNames.ums,
    ),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
