import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LocalAuthGuard } from 'src/auth/local.auth.guard';
import { AunthenticatedGuard } from 'src/auth/authenticated.guard';

// http//:localhost:3000/users/
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  // http//:localhost:3000/users/signup
  @Post('/signup')
  @HttpCode(HttpStatus.CREATED)
  @Header('Content-type', 'application/json')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  // http//:localhost:3000/users/login
  @Post('/login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  login(@Request() req) {
    return { user: req.user, msg: 'Logged in' };
  }

  // http//:localhost:3000/users/login-check
  @Get('/login-check')
  @UseGuards(AunthenticatedGuard)
  loginCheck(@Request() req) {
    return req.user;
  }

  // http//:localhost:3000/users/logout
  @Get('/logout')
  logout(@Request() req) {
    req.session.destroy();
    return { msg: 'Session has ended' };
  }
}
