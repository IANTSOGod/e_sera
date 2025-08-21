import { InjectQueue } from '@nestjs/bullmq';
import {
  BadRequestException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Queue } from 'bullmq';
import { v2 as Cloudinary } from 'cloudinary';
import { CLOUDINARY } from 'src/cloudinary/cloudinary.provider';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { ProfileWithMulterDto } from 'src/interfaces/dto/profilephoto.dto';
import { Resultdto } from 'src/interfaces/dto/result.dto';
import { Uploadmqdto } from 'src/interfaces/dto/uploadmq.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    @InjectQueue('user-upload') private photoqueue: Queue,
    private readonly cloudinaryservice: CloudinaryService,
    @Inject(CLOUDINARY) private readonly cloud: typeof Cloudinary,
  ) {}

  async setprofile(data: Uploadmqdto) {
    try {
      // const newdata = {
      //   email: data.email,
      //   file: {
      //     buffer: data.file.buffer.toString('base64'), // Conversion en base64
      //     originalname: data.file.originalname,
      //     mimetype: data.file.mimetype,
      //     size: data.file.size,
      //   },
      // };
      await this.photoqueue.add('sendPhoto', data, {
        attempts: 5,
        backoff: 2000,
      });
    } catch (error) {
      console.log(error);
      throw new HttpException({ message: 'Erreur de queue upload' }, 405);
    }
  }

  //fonction de modification de profile
  async updateProfile(data: ProfileWithMulterDto) {
    if (!data.email || !data.file) {
      throw new BadRequestException('Email et fichier sont requis');
    }

    const user = await this.prismaService.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    try {
      // Upload du fichier vers Cloudinary
      const uploadResult = await this.cloudinaryservice.uploadFile(
        data.file.buffer,
        `user_${user.id}_${Date.now()}`,
      );

      // Mise à jour de la base de données
      const updatedUser = await this.prismaService.user.update({
        where: { id: user.id },
        data: {
          photolink: uploadResult.secure_url,
        },
        select: {
          id: true,
          email: true,
          photolink: true,
        },
      });
      const res = {
        message: 'Photo uploadé',
        photoUrl: updatedUser.photolink,
      } as Resultdto;
      console.log(res);
      return res;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:');

      if (
        error instanceof BadRequestException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Une erreur interne est survenue lors de la mise à jour du profil',
      );
    }
  }

  // Méthode utilitaire pour supprimer une ancienne photo de profil
  async deleteOldProfilePhoto(publicId: string): Promise<void> {
    try {
      await this.cloud.uploader.destroy(publicId);
    } catch (error) {
      console.warn("Impossible de supprimer l'ancienne photo:", error);
      // Ne pas faire échouer l'opération principale si la suppression échoue
    }
  }

  // Méthode pour obtenir le profil utilisateur
  async getUserProfile(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        photolink: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    return user;
  }
}
