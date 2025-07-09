// src/app.module.ts

import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggerMiddleware } from './logger/logger.middleware';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AuthModule, PostsModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware) // can add multiple middleware here
      .forRoutes('*'); // apply to all routes

    // or apply to specific ones
    // .forRoutes({ path: 'posts', method: RequestMethod.GET })
  }
}
