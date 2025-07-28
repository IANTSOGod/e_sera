import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { EmailModule } from 'src/email/email.module';
import { OtpModule } from 'src/otp/otp.module';
import { PrismaService } from 'src/prisma.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAccessAuthGuard } from './guards/JwtAccessAuthGuard';
import { JwtRefreshAuthGuard } from './guards/JwtRefreshAuthGuard';
import { JwtAccessStrategy } from './strategies/JwtAccessStrategy';
import { JwtRefreshStrategy } from './strategies/JwtRefreshStrategy';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_ACCESS_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    OtpModule,
    EmailModule,
  ],
  providers: [
    AuthService,
    PrismaService,
    JwtAccessStrategy,
    JwtAccessAuthGuard,
    JwtRefreshStrategy,
    JwtRefreshAuthGuard,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
