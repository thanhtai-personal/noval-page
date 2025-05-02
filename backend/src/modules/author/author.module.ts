import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Author, AuthorSchema } from '@/schemas/author.schema';
import { Story, StorySchema } from '@/schemas/story.schema';
import { AuthorController } from './author.controller';
import { AuthorService } from './author.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Author.name, schema: AuthorSchema },
      { name: Story.name, schema: StorySchema },
    ]),
  ],
  controllers: [AuthorController],
  providers: [AuthorService],
})
export class AuthorModule {}
