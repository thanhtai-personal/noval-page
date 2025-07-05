import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from '@/schemas/blog.schema';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { DBNames } from '@/utils/database';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Blog.name, schema: BlogSchema }],
      DBNames.ums,
    ),
  ],
  controllers: [BlogController],
  providers: [BlogService],
})
export class BlogModule {}
