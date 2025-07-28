import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Accesstokendto } from 'src/interfaces/dto/accesstoken.dto';
import { Credentialdto } from 'src/interfaces/dto/credential.dto';
import { Logindto } from 'src/interfaces/dto/login.dto';
import { Signupdto } from 'src/interfaces/dto/signup.dto';
import { AuthService } from './auth.service';
import { JwtAccessAuthGuard } from './guards/JwtAccessAuthGuard';
import { JwtRefreshAuthGuard } from './guards/JwtRefreshAuthGuard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authservice: AuthService) {}

  @UseGuards(JwtAccessAuthGuard)
  @Get('/me')
  private me(@Request() req: { user: Credentialdto }) {
    return req.user;
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Get('/access')
  private access(@Request() req: { user: Accesstokendto }) {
    return { accessToken: req.user.accesstoken };
  }

  @Post('/login')
  async login(@Body() body: Logindto) {
    return this.authservice.login(body);
  }

  @Post('/register/EAP')
  async registerEAP(@Body() body: Signupdto) {
    return this.authservice.registerEmailandPassword(body);
  }
}
