import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from '@/schemas/comment.schema';
import { Story, StorySchema } from '@/schemas/story.schema';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { Role, RoleSchema } from "@/schemas/role.schema";
import { User, UserSchema } from "@/schemas/user.schema";
import { DBNames } from "@/utils/database";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Role.name, schema: RoleSchema },
    ], DBNames.ums),
    MongooseModule.forFeature([
      { name: Comment.name, schema: CommentSchema },
      { name: Story.name, schema: StorySchema },
    ], DBNames.story1),
    MongooseModule.forFeature([
      { name: Comment.name, schema: CommentSchema },
      { name: Story.name, schema: StorySchema },
    ], DBNames.story2),
    MongooseModule.forFeature([
      { name: Comment.name, schema: CommentSchema },
      { name: Story.name, schema: StorySchema },
    ], DBNames.story3),
    MongooseModule.forFeature([
      { name: Comment.name, schema: CommentSchema },
      { name: Story.name, schema: StorySchema },
    ], DBNames.story4),
    MongooseModule.forFeature([
      { name: Comment.name, schema: CommentSchema },
      { name: Story.name, schema: StorySchema },
    ], DBNames.story5),
  ],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule { }
