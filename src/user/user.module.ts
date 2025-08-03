import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CloudinaryProvider } from './cloudinary.provider';
import { ProfileProcessor } from './profile.processor';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'user-upload',
    }),
  ],
  controllers: [UserController],
  providers: [UserService, PrismaService, CloudinaryProvider, ProfileProcessor],
  exports: [UserService],
})
export class UserModule {}
