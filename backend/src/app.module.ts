import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from "@nestjs/config";

// Schemas
import { Story, StorySchema } from '@/schemas/story.schema';
import { Chapter, ChapterSchema } from '@/schemas/chapter.schema';
import { Author, AuthorSchema } from '@/schemas/author.schema';
import { Category, CategorySchema } from '@/schemas/category.schema';
import { Tag, TagSchema } from '@/schemas/tag.schema';
import { User, UserSchema } from '@/schemas/user.schema';
import { Role, RoleSchema } from '@/schemas/role.schema';
import { Comment, CommentSchema } from '@/schemas/comment.schema';
import { Source, SourceSchema } from "./schemas/source.schema";

// Modules
import { CrawlerModule } from '@/modules/crawler/crawler.module';
import { StoryModule } from "./modules/story/story.module";
import { ChapterModule } from "./modules/chapter/chapter.module";
import { AuthorModule } from "./modules/author/author.module";
import { UserModule } from "./modules/user/user.module";
import { RoleModule } from "./modules/role/role.module";
import { CommentModule } from "./modules/comment/comment.module";
import { CategoryModule } from "./modules/category/category.module";
import { TagModule } from "./modules/tag/tag.module";
import { AuthModule } from "./modules/auth/auth.module";
import { SourceModule } from "./modules/source/source.module";

// Middleware
import { LoggerMiddleware } from "@/common/middlewares/logger.middleware";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";
import { ScheduleModule } from "@nestjs/schedule";
import { CrawlerGateway } from "./modules/crawler/crawler.gateway";
import { BlogModule } from './modules/blog/blog.module';
import { RolesGuard } from './modules/auth/guards/role.guard';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { DB_STORIES_NAMES, DBNames, getDBURIs } from "./utils/database";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'short',
          ttl: 60,
          limit: 10,
        },
        {
          name: 'medium',
          ttl: 600,
          limit: 50
        },
        {
          name: 'long',
          ttl: 6000,
          limit: 250
        }
      ],
    }),

    
    MongooseModule.forRootAsync({
      connectionName: DBNames.ums,
      useFactory: () => ({
        uri: getDBURIs().UMS,
      }),
    }),
    ...DB_STORIES_NAMES.map((name, index) => MongooseModule.forRootAsync({
      connectionName: name,
      useFactory: () => ({
        uri: getDBURIs().STORIES[index],
      }),
    })),

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
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    CrawlerGateway,
    JwtAuthGuard,
    RolesGuard
  ],
})
  
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
