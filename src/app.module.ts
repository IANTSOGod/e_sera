import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_SERVER,
        port: parseInt(process.env.REDIS_PORT as string),
      },
    }),
    AuthModule,
    EmailModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
