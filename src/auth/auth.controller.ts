import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AccessSwagger } from 'src/interfaces/decorator/Access.decorator';
import { LoginSwagger } from 'src/interfaces/decorator/Login.decorator';
import { Meswagger } from 'src/interfaces/decorator/Me.decorator';
import { RegisterSwagger } from 'src/interfaces/decorator/Register.decorator';
import { ResetpasswordSwagger } from 'src/interfaces/decorator/Resetpassword.decorator';
import { SendotpSwagger } from 'src/interfaces/decorator/Sendotp.decorator';
import { SendResetSwagger } from 'src/interfaces/decorator/SendReset.decorator';
import { VerifyotpSwagger } from 'src/interfaces/decorator/Verifyotp.decorator';
import { Accesstokendto } from 'src/interfaces/dto/accesstoken.dto';
import { Credentialdto } from 'src/interfaces/dto/credential.dto';
import { Logindto } from 'src/interfaces/dto/login.dto';
import { OtpSendDto } from 'src/interfaces/dto/OtpSend.dto';
import { OtpVerificationDto } from 'src/interfaces/dto/OtpVerification.dto';
import { ResetpasswordDto } from 'src/interfaces/dto/Resetpassword.dto';
import { Signupdto } from 'src/interfaces/dto/signup.dto';
import { AuthService } from './auth.service';
import { JwtAccessAuthGuard } from './guards/JwtAccessAuthGuard';
import { JwtRefreshAuthGuard } from './guards/JwtRefreshAuthGuard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authservice: AuthService) {}

  @UseGuards(JwtAccessAuthGuard)
  @Get('/me')
  @Meswagger()
  private me(@Request() req: { user: Credentialdto }) {
    return req.user;
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Get('/access')
  @AccessSwagger()
  private access(@Request() req: { user: Accesstokendto }) {
    return { accessToken: req.user.accesstoken };
  }

  @Post('/login')
  @LoginSwagger()
  async login(@Body() body: Logindto) {
    return this.authservice.login(body);
  }

  @Post('/register/EAP')
  @RegisterSwagger()
  async registerEAP(@Body() body: Signupdto) {
    return this.authservice.registerEmailandPassword(body);
  }

  @Post('/sendotp')
  @SendotpSwagger()
  async sendotp(@Body() body: OtpSendDto) {
    return this.authservice.sendOtp(body);
  }

  @Post('/verifyotp')
  @VerifyotpSwagger()
  async verifyotp(@Body() body: OtpVerificationDto) {
    return this.authservice.verifyAccount(body);
  }

  @Post('/sendresetcode')
  @SendResetSwagger()
  async sendresetcode(@Body() body: OtpSendDto) {
    return this.authservice.sendResetCode(body);
  }

  @Post('/resetpassword')
  @ResetpasswordSwagger()
  async resetpassword(@Body() body: ResetpasswordDto) {
    return this.authservice.resetPassword(body);
  }
}
