import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class Logindto {
  @IsNotEmpty({ message: 'Email non vide' })
  @IsEmail({}, { message: 'Email non valide' })
  @ApiProperty({
    description: 'Email a authentifié',
    example: 'iantsochristianrazafindrazaka@gmail.com',
  })
  email: string;
  @IsNotEmpty({ message: 'Mot de passe non vide' })
  @MinLength(8, { message: 'Mot de passe trop court' })
  @ApiProperty({
    description: 'Mot de passe user (regex a faire en front)',
    example: 'testlasave',
  })
  password: string;
}
