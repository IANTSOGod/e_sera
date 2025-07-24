import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAccessAuthGuard } from './guards/JwtAccessAuthGuard';
import { JwtStrategy } from './strategies/JwtStrategy';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_ACCESS_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService, PrismaService, JwtStrategy, JwtAccessAuthGuard],
  controllers: [AuthController],
})
export class AuthModule {}
