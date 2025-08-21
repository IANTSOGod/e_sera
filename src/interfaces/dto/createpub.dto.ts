import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class Createpubdto {
  @IsNotEmpty({ message: 'Createur non null' })
  @ApiProperty({
    description: "L'id du createur de publication",
    example: 'gigoaeh0ega88',
  })
  creator_id: string;
  @IsNotEmpty({ message: 'Titre non null' })
  @ApiProperty({
    description: 'Titre de la publication',
    example: 'Roue',
  })
  title: string;
  @IsNotEmpty({ message: 'Description non null' })
  @ApiProperty({
    description: 'Contenu de la publication',
    example: 'Ceci est une roue',
  })
  description: string;
}
