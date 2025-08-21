import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { PrismaService } from 'src/prisma.service';
import { ProfileProcessor } from './profile.processor';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'user-upload',
    }),
    CloudinaryModule,
  ],
  controllers: [UserController],
  providers: [UserService, PrismaService, ProfileProcessor],
  exports: [UserService],
})
export class UserModule {}
