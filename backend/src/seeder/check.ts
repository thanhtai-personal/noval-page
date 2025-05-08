// src/seeder/check.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Role } from '@/schemas/role.schema';
import { User } from '@/schemas/user.schema';
import { Source } from '@/schemas/source.schema';
import { checkRoles } from './roles.check';
import { checkUsers } from './users.check';
import { checkSources } from './sources.check';
import * as crypto from 'crypto';

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

  const roleModel = app.get(getModelToken(Role.name));
  const userModel = app.get(getModelToken(User.name));
  const sourceModel = app.get(getModelToken(Source.name));

  await checkRoles(roleModel);
  await checkUsers(userModel);
  await checkSources(sourceModel);

  await app.close();
}
bootstrap();
