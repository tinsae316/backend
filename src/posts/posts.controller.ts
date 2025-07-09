import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  UseGuards,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Post()
  create(@Body() dto: CreatePostDto, @Req() req: Request) {
    const user = req.user as { userId: string };
    return this.postsService.createPost(user.userId, dto);
  }

  @Get()
  findUserPosts(@Req() req: Request) {
    const user = req.user as { userId: string };
    return this.postsService.getPostsByUser(user.userId);
  }

  @Delete(':id')
  deletePost(@Param('id') postId: string, @Req() req: Request) {
    const user = req.user as { userId: string };
    return this.postsService.deletePost(user.userId, postId);
  }

  @Patch(':id')
  updatePost(
    @Param('id') postId: string,
    @Body() dto: CreatePostDto,
    @Req() req: Request,
  ) {
    const user = req.user as { userId: string };
    return this.postsService.updatePost(user.userId, postId, dto);
  }
}
