import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { v2 as Cloudinary } from 'cloudinary';
import { CloudinaryResponse } from 'src/interfaces/dto/cloudinary.dto';
import { CLOUDINARY } from './cloudinary.provider';

@Injectable()
export class CloudinaryService {
  constructor(
    @Inject(CLOUDINARY) private readonly cloudinary: typeof Cloudinary,
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
              { width: 400, height: 400, crop: 'fill' },
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
}
