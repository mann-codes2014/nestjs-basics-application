import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UserController {
  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }
}
