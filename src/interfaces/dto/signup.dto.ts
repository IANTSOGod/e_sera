import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class Signupdto {
  @IsNotEmpty({ message: 'Username non vide' })
  @ApiProperty({
    description: 'Username utilisateur',
    example: 'Iantso Christian',
  })
  username: string;
  @IsNotEmpty({ message: 'Email non vide' })
  @IsEmail({}, { message: 'Email non valide' })
  @ApiProperty({
    description: 'Email a inscrire',
    example: 'iantsochristianrazafindrazaka@gmail.com',
  })
  email: string;
  @IsNotEmpty({ message: 'Mot de passe non vide' })
  @IsStrongPassword({}, { message: 'Mdp trop simple' })
  @ApiProperty({
    description: 'Mot de passe utilisateur',
    example: 'Iantso123!',
  })
  password: string;
}
