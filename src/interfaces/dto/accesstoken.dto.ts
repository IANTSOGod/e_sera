import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class Accesstokendto {
  @IsNotEmpty({ message: 'Token non null' })
  @ApiProperty({ description: "Ceci est un token d'acces" })
  accesstoken: string;
}
