import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Createpubdto } from 'src/interfaces/dto/createpub.dto';
import { Rattachphototopub } from 'src/interfaces/dto/rattachphoto.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PublicationService {
  constructor(
    private readonly prismaservice: PrismaService,
    private readonly cloudinaryservice: CloudinaryService,
  ) {}

  async createBasicpub(data: Createpubdto) {
    const { title, description, creator_id } = data;
    try {
      const result = await this.prismaservice.publication.create({
        data: {
          title: title,
          description: description,
          creator_id: creator_id,
        },
      });
      if (result) {
        return { message: 'Publication créé' };
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException({
        message: 'Creation publication échoué',
      });
    }
  }

  async rattachphototopub(data: Rattachphototopub) {
    const { pub_id, file } = data;
    const pub = await this.prismaservice.publication.findUnique({
      where: {
        id: pub_id,
      },
    });
    if (pub) {
      try {
        const response = await this.cloudinaryservice.uploadFile(
          file.buffer,
          file.originalname,
        );
        if (response) {
          await this.prismaservice.photos.create({
            data: {
              photo_link: response.secure_url,
              uploader_id: pub_id,
            },
          });
        }
      } catch (error) {
        console.log(error);
        throw new InternalServerErrorException({ message: 'Erreur upload' });
      }
    } else {
      throw new NotFoundException({ message: 'Publication non trouvé' });
    }
  }
}
