import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Role } from '@/schemas/role.schema';
import { User } from '@/schemas/user.schema';
import { seedRoles } from './roles.seed';
import { seedUsers } from './users.seed';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const roleModel = app.get(getModelToken(Role.name));
  const userModel = app.get(getModelToken(User.name));

  await seedRoles(roleModel);
  await seedUsers(userModel, roleModel);

  await app.close();
}
bootstrap();
