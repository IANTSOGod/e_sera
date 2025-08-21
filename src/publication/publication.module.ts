import { Module } from '@nestjs/common';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { PrismaService } from 'src/prisma.service';
import { PublicationController } from './publication.controller';
import { PublicationService } from './publication.service';

@Module({
  imports: [CloudinaryModule],
  controllers: [PublicationController],
  providers: [PublicationService, PrismaService],
})
export class PublicationModule {}
