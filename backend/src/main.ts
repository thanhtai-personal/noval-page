import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { JwtAuthGuard } from "./modules/auth/guards/jwt-auth.guard";
import { RolesGuard } from "./modules/auth/guards/role.guard";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3001', 'http://localhost:3000'],
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
  SwaggerModule.setup('docs', app, document); // http://localhost:5000/docs

  const reflector = app.get(Reflector);
  app.useGlobalGuards(
    new JwtAuthGuard(reflector),
    new RolesGuard(reflector),
  );


  await app.listen(process.env.PORT || 5000);
}
bootstrap();
