// profilephoto.dto.ts
import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, ValidateNested } from 'class-validator';

export class FileDto {
  @IsNotEmpty({ message: 'Le buffer du fichier est requis' })
  buffer: Buffer;

  @IsNotEmpty({ message: 'Le nom du fichier est requis' })
  filename: string;

  mimetype?: string;
  size?: number;
}

export class Profiledto {
  @IsEmail({}, { message: 'Email invalide' })
  @IsNotEmpty({ message: 'Email requis' })
  email: string;

  @ValidateNested()
  @Type(() => FileDto)
  @IsNotEmpty({ message: 'Fichier requis' })
  file: FileDto;
}

// Alternative si vous utilisez Multer
export interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
  filename?: string;
}

export class ProfileWithMulterDto {
  @IsEmail({}, { message: 'Email invalide' })
  @IsNotEmpty({ message: 'Email requis' })
  email: string;

  file: MulterFile;
}
