// src/common/database/multi-db.providers.ts
import { MongooseModule } from '@nestjs/mongoose';
import { DB_STORIES_NAMES, getStoryDBList, DBNames } from '@/utils/dbConfig';
import { Author, AuthorSchema } from "@/schemas/author.schema";
import { Blog, BlogSchema } from "@/schemas/blog.schema";
import { Category, CategorySchema } from "@/schemas/category.schema";
import { Chapter, ChapterSchema } from "@/schemas/chapter.schema";
import { Comment, CommentSchema } from "@/schemas/comment.schema";
import { CrawlHistory, CrawlHistorySchema } from "@/schemas/crawlHistory.schema";
import { Level, LevelSchema } from "@/schemas/level.schema";
import { Role, RoleSchema } from "@/schemas/role.schema";
import { Source, SourceSchema } from "@/schemas/source.schema";
import { Story, StorySchema } from "@/schemas/story.schema";
import { Tag, TagSchema } from "@/schemas/tag.schema";
import { User, UserSchema } from "@/schemas/user.schema";

export const MongoDBProvider = [
  MongooseModule.forRoot(process.env.DB_UMS_MODELS!, { connectionName: DBNames.ums }),
  // Các DB connections khác từ DB_STORIES_NAMES
  ...DB_STORIES_NAMES.map((name, index) =>
    MongooseModule.forRootAsync({
      connectionName: name, // sử dụng tên rõ ràng
      useFactory: async () => ({
        uri: getStoryDBList()[index],
        connectionName: DB_STORIES_NAMES[index],
      }),
    })
  ),

  // Các schema dùng chung (UMS)
  MongooseModule.forFeature(
    [
      { name: Author.name, schema: AuthorSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Tag.name, schema: TagSchema },
      { name: User.name, schema: UserSchema },
      { name: Role.name, schema: RoleSchema },
      { name: Level.name, schema: LevelSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: Source.name, schema: SourceSchema },
      { name: Blog.name, schema: BlogSchema },
      { name: CrawlHistory.name, schema: CrawlHistorySchema },
    ],
    DBNames.ums,
  ),

  // Schema đặc thù (cho stories DBs)
  ...DB_STORIES_NAMES.map((name) =>
    MongooseModule.forFeature(
      [
        { name: Story.name, schema: StorySchema },
        { name: Chapter.name, schema: ChapterSchema },
      ],
      name,
    ),
  ),
];

