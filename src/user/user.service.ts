// user.service.ts
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
import { CloudinaryResponse } from 'src/interfaces/dto/cloudinary.dto';
import { ProfileWithMulterDto } from 'src/interfaces/dto/profilephoto.dto';
import { Resultdto } from 'src/interfaces/dto/result.dto';
import { Uploadmqdto } from 'src/interfaces/dto/uploadmq.dto';
import { PrismaService } from 'src/prisma.service';
import { CLOUDINARY } from './cloudinary.provider';

@Injectable()
export class UserService {
  constructor(
    @Inject(CLOUDINARY) private readonly cloudinary: typeof Cloudinary,
    private readonly prismaService: PrismaService,
    @InjectQueue('user-upload') private photoqueue: Queue,
  ) {}

  async uploadFile(
    buffer: Buffer,
    filename: string,
  ): Promise<CloudinaryResponse> {
    if (!buffer || buffer.length === 0) {
      throw new BadRequestException('Le fichier est vide ou invalide');
    }

    if (!filename || filename.trim() === '') {
      throw new BadRequestException('Le nom du fichier est requis');
    }

    return new Promise((resolve, reject) => {
      this.cloudinary.uploader
        .upload_stream(
          {
            public_id: filename,
            resource_type: 'auto',
            folder: 'user-profiles',
            transformation: [
              { width: 400, height: 400, crop: 'fill' }, // Optimisation des images de profil
              { quality: 'auto' },
            ],
          },
          (error, result) => {
            if (error) {
              reject(
                new InternalServerErrorException(
                  `Échec du téléchargement du fichier "${filename}": ${error.message}`,
                ),
              );
            } else if (result) {
              resolve(result as CloudinaryResponse);
            } else {
              reject(
                new InternalServerErrorException(
                  'Échec du téléchargement: aucun résultat retourné',
                ),
              );
            }
          },
        )
        .end(buffer);
    });
  }

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
      const uploadResult = await this.uploadFile(
        data.file.buffer,
        `user_${user.id}_${Date.now()}`, // Nom unique pour éviter les conflits
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
      await this.cloudinary.uploader.destroy(publicId);
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
