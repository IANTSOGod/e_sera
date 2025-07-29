import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class Credentialdto {
  @IsNotEmpty({ message: 'Email non vide' })
  @IsEmail({}, { message: 'Email invalide' })
  @ApiProperty({
    description: 'Email utilisateur',
    example: 'iantsochristianrazafindrazaka@gmail.com',
  })
  email: string;
  @IsNotEmpty({ message: 'Username non null' })
  @ApiProperty({ description: 'Username', example: 'Iantso Christian' })
  username: string;
  @IsNotEmpty({ message: 'Photo non null' })
  @ApiProperty({
    description: 'Lien de la photo',
    example: 'http://localhost:5471/photos',
  })
  photolink: string;
}
