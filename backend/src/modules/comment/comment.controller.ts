import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Public } from "../auth/decorators/public.decorator";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { RoleSlug } from "@/constants/role.enum";
import { Roles } from "../auth/decorators/roles.decorator";

@Controller('stories/:slug/comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Public()
  @Get()
  getComments(@Param('slug') slug: string) {
    return this.commentService.getCommentsByStorySlug(slug);
  }

  @Post()
  @Roles(RoleSlug.READER)
  createComment(
    @Param('slug') slug: string,
    @Body() dto: CreateCommentDto,
    @CurrentUser('userId') userId: string,
  ) {
    return this.commentService.createComment(slug, dto);
  }
}
