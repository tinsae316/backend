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
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Post()
  create(@Body() dto: CreatePostDto, @Req() req: Request) {
    const user = req.user as { id: string };
    return this.postsService.createPost(user.id, dto);
  }

  @Get()
  findUserPosts(@Req() req: Request) {
    const user = req.user as { id: string };
    return this.postsService.getPostsByUser(user.id);
  }

  @Get('all')
  getAllPosts() {
    return this.postsService.getAllPosts();
  }

  @Get(':id')
  getPostById(@Param('id') postId: string) {
    return this.postsService.getPostById(postId);
  }

  @Delete(':id')
  deletePost(@Param('id') postId: string, @Req() req: Request) {
    const user = req.user as { id: string };
    return this.postsService.deletePost(user.id, postId);
  }

  @Patch(':id')
  updatePost(
    @Param('id') postId: string,
    @Body() dto: UpdatePostDto,
    @Req() req: Request,
  ) {
    const user = req.user as { id: string };
    return this.postsService.updatePost(user.id, postId, dto);
  }
}
