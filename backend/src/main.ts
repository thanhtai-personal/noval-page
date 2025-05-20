import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from './modules/auth/guards/role.guard';
import * as crypto from 'crypto';

// 🛡 Gán globalThis.crypto.randomUUID nếu chưa có (Node < 19)
if (
  typeof globalThis.crypto === 'undefined' ||
  typeof globalThis.crypto.randomUUID !== 'function'
) {
  (globalThis as any).crypto = {
    randomUUID: () => crypto.randomUUID(),
  };
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://localhost:3001',
      'http://localhost:3000',
      'https://noval-page.vercel.app',
      'https://noval-page-yadu.vercel.app',
    ],
    credentials: true,
  });

  // Swagger config
  const config = new DocumentBuilder()
    .setTitle('Web Truyện API')
    .setDescription('Tài liệu API cho hệ thống Web Truyện')
    .setVersion('1.0')
    .addTag('webtruyen')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector), new RolesGuard(reflector));

  await app.listen(process.env.PORT || 8000);
}
bootstrap();
