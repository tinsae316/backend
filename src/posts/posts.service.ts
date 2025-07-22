import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async createPost(userId: string, dto: CreatePostDto) {
    const post = await this.prisma.post.create({
      data: {
        title: dto.title,
        content: dto.content,
        authorId: userId,
      },
    }) as any;
    // Remove updatedAt if it's the same as createdAt
    if (post.updatedAt.getTime() === post.createdAt.getTime()) {
      const { updatedAt, ...rest } = post;
      return rest;
    }
    return post;
  }

  async getPostsByUser(userId: string) {
    const posts = await this.prisma.post.findMany({
      where: {
        authorId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      },
    }) as any[];
    // Remove updatedAt if it's the same as createdAt
    return posts.map(post => {
      if (post.updatedAt.getTime() === post.createdAt.getTime()) {
        const { updatedAt, ...rest } = post;
        return rest;
      }
      return post;
    });
  }

  async getAllPosts() {
    const posts = await this.prisma.post.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      },
    }) as any[];
    // Remove updatedAt if it's the same as createdAt
    return posts.map(post => {
      if (post.updatedAt.getTime() === post.createdAt.getTime()) {
        const { updatedAt, ...rest } = post;
        return rest;
      }
      return post;
    });
  }

  

  async getPostByIdForUser(userId: string, postId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    if (!post) throw new NotFoundException('Post not found');
    if (post.authorId !== userId) throw new ForbiddenException('Access denied');
    // Remove updatedAt if it's the same as createdAt
    if (post.updatedAt.getTime() === post.createdAt.getTime()) {
      const { updatedAt, ...rest } = post;
      return rest;
    }
    return post;
  }

  async getPostById(postId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    if (!post) throw new NotFoundException('Post not found');
    // Remove updatedAt if it's the same as createdAt
    if (post.updatedAt.getTime() === post.createdAt.getTime()) {
      const { updatedAt, ...rest } = post;
      return rest;
    }
    return post;
  }

  async deletePost(userId: string, postId: string) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });

    if (!post) throw new NotFoundException('Post not found');
    if (post.authorId !== userId) throw new ForbiddenException('Access denied');

    return this.prisma.post.delete({ where: { id: postId } });
  }

  async updatePost(userId: string, postId: string, dto: UpdatePostDto) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });

    if (!post) throw new NotFoundException('Post not found');
    if (post.authorId !== userId) throw new ForbiddenException('Access denied');

    return this.prisma.post.update({
      where: { id: postId },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.content !== undefined && { content: dto.content }),
      },
    });
  }
}
