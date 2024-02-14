import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthService } from './auth.service';
import { UserRepository } from './users.repository';
import { CurrentUserInterceptor } from './interceptor/current-user.interceptor';

@Module({
  controllers: [UsersController],
  providers: [UsersService, AuthService, UserRepository,
   { provide: APP_INTERCEPTOR ,
    useClass :CurrentUserInterceptor  //making interceptor global
}],
})
export class UsersModule {}
