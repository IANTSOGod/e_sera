import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { PrismaService } from './prisma.service';
import { UserModule } from './user/user.module';
import { PublicationModule } from './publication/publication.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_SERVER,
        port: parseInt(process.env.REDIS_PORT as string),
      },
    }),
    AuthModule,
    EmailModule,
    UserModule,
    PublicationModule,
    CloudinaryModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
