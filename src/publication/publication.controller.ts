import { Body, Controller, Post, UploadedFile } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Publicationswagger } from 'src/interfaces/decorator/Publication.decorator';
import { Createpubdto } from 'src/interfaces/dto/createpub.dto';
import { Rattachphototopub } from 'src/interfaces/dto/rattachphoto.dto';
import { PublicationService } from './publication.service';

@ApiTags('Publication')
@Controller('publication')
export class PublicationController {
  constructor(private readonly publicationservice: PublicationService) {}

  @Post('createbasic')
  @Publicationswagger()
  async createbasicpub(@Body() data: Createpubdto) {
    return this.publicationservice.createBasicpub(data);
  }

  @Post('addphotopub')
  async addphoto(
    @Body() data: { pub_id: string },
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.publicationservice.rattachphototopub({
      pub_id: data.pub_id,
      file: file,
    } as Rattachphototopub);
  }
}
