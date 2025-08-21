import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class Logindto {
  @IsNotEmpty({ message: 'Email non vide' })
  @IsEmail({}, { message: 'Email non valide' })
  @ApiProperty({
    description: 'Email a authentifié',
    example: 'iantsochristianrazafindrazaka@gmail.com',
  })
  email: string;
  @IsNotEmpty({ message: 'Mot de passe non vide' })
  @IsStrongPassword({}, { message: 'Mot de passe trop faible' })
  @ApiProperty({
    description: 'Mot de passe user (regex a faire en front)',
    example: 'testlasave',
  })
  password: string;
}
