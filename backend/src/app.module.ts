import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

// Modules
import { CrawlerModule } from '@/modules/crawler/crawler.module';
import { StoryModule } from './modules/story/story.module';
import { ChapterModule } from './modules/chapter/chapter.module';
import { AuthorModule } from './modules/author/author.module';
import { UserModule } from './modules/user/user.module';
import { RoleModule } from './modules/role/role.module';
import { CommentModule } from './modules/comment/comment.module';
import { CategoryModule } from './modules/category/category.module';
import { TagModule } from './modules/tag/tag.module';
import { AuthModule } from './modules/auth/auth.module';
import { SourceModule } from './modules/source/source.module';
import { BlogModule } from './modules/blog/blog.module';
import { LevelModule } from './modules/level/level.module';

// Middleware & Gateway & Guards
import { LoggerMiddleware } from '@/common/middlewares/logger.middleware';
import { CrawlerGateway } from './modules/crawler/crawler.gateway';
import { RolesGuard } from './modules/auth/guards/role.guard';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';

// Providers
import { MongoDBProvider } from './common/database/multi-db.providers';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),

    ThrottlerModule.forRoot({
      throttlers: [
        { name: 'short', ttl: 60, limit: 10 },
        { name: 'medium', ttl: 600, limit: 50 },
        { name: 'long', ttl: 6000, limit: 250 },
      ],
    }),

    // Kết nối các DB từ MultiDbProviders
    ...MongoDBProvider,

    // Feature Modules
    CrawlerModule,
    StoryModule,
    ChapterModule,
    AuthorModule,
    UserModule,
    RoleModule,
    CommentModule,
    CategoryModule,
    TagModule,
    AuthModule,
    SourceModule,
    BlogModule,
    LevelModule,
  ],

  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    CrawlerGateway,
    JwtAuthGuard,
    RolesGuard,
  ],
})
  
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
