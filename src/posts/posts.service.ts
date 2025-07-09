import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async createPost(userId: string, dto: CreatePostDto) {
    return this.prisma.post.create({
      data: {
        title: dto.title,
        content: dto.content,
        authorId: userId,
      },
    });
  }

  async getPostsByUser(userId: string) {
    return this.prisma.post.findMany({
      where: {
        authorId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async deletePost(userId: string, postId: string) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });

    if (!post) throw new NotFoundException('Post not found');
    if (post.authorId !== userId) throw new ForbiddenException('Access denied');

    return this.prisma.post.delete({ where: { id: postId } });
  }

  async updatePost(userId: string, postId: string, dto: CreatePostDto) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });

    if (!post) throw new NotFoundException('Post not found');
    if (post.authorId !== userId) throw new ForbiddenException('Access denied');

    return this.prisma.post.update({
      where: { id: postId },
      data: {
        title: dto.title,
        content: dto.content,
      },
    });
  }
}
