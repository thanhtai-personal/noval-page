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

// Middleware
import { LoggerMiddleware } from '@/common/middlewares/logger.middleware';
import { ThrottlerModule } from "@nestjs/throttler";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot({
      throttlers: [{
        ttl: 60,     // 60 giây
        limit: 10,   // tối đa 10 request trong khoảng đó
      }],
    }),
    MongooseModule.forRoot(process.env.NODE_ENV === 'docker' ? process.env.MONGO_URI! : 'mongodb://localhost:27017/truyen'),
    MongooseModule.forFeature([
      { name: Story.name, schema: StorySchema },
      { name: Chapter.name, schema: ChapterSchema },
      { name: Author.name, schema: AuthorSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Tag.name, schema: TagSchema },
      { name: User.name, schema: UserSchema },
      { name: Role.name, schema: RoleSchema },
      { name: Comment.name, schema: CommentSchema },
    ]),
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
  ],
})
  
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
