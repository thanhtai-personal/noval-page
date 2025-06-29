// src/seeder/seed.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Role } from '@/schemas/role.schema';
import { User } from '@/schemas/user.schema';
import { Source } from '@/schemas/source.schema';
import { seedRoles } from './roles.seed';
import { seedUsers } from './users.seed';
import { seedSources } from './sources.seed';
import * as crypto from 'crypto';
import { DBNames } from "@/utils/database";

if (
  typeof globalThis.crypto === 'undefined' ||
  typeof globalThis.crypto.randomUUID !== 'function'
) {
  (globalThis as any).crypto = {
    randomUUID: () => crypto.randomUUID(),
  };
}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const roleModel = app.get(getModelToken(Role.name, DBNames.ums));
  const userModel = app.get(getModelToken(User.name, DBNames.ums));
  const sourceModel = app.get(getModelToken(Source.name, DBNames.story1));

  await seedRoles(roleModel);
  await seedUsers(userModel, roleModel);
  await seedSources(sourceModel);

  await app.close();
}
bootstrap();
