import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CrawlerModule } from '@/modules/crawler/crawler.module';
import { Story, StorySchema } from '@/schemas/story.schema';
import { Chapter, ChapterSchema } from '@/schemas/chapter.schema';
import { Author, AuthorSchema } from '@/schemas/author.schema';
import { Category, CategorySchema } from '@/schemas/category.schema';
import { Tag, TagSchema } from '@/schemas/tag.schema';
import { User, UserSchema } from '@/schemas/user.schema';
import { Role, RoleSchema } from '@/schemas/role.schema';
import { Comment, CommentSchema } from '@/schemas/comment.schema';

if (!process.env.MONGO_URI) {
  throw new Error('❌ MONGO_URI is not defined in .env');
}

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI),
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
  ],
})
export class AppModule {}
