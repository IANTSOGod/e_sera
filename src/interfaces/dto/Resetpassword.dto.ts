import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Length, MinLength } from 'class-validator';

export class ResetpasswordDto {
  @IsNotEmpty({ message: 'Email non vide' })
  @IsEmail({}, { message: 'Email non valide' })
  @ApiProperty({
    description: 'Email a changer de mdp',
    example: 'iantsochristianrazafindrazaka@gmail.com',
  })
  email: string;
  @IsNotEmpty({ message: 'Otp non vide' })
  @Length(6, 6, { message: 'Otp non conforme' })
  @ApiProperty({ description: 'Otp a verifie', example: '123456' })
  otp: string;
  @IsNotEmpty({ message: 'Mot de passe non vide' })
  @MinLength(8, { message: 'Mot de passe trop court' })
  @ApiProperty({
    description: 'Nouveau mdp utilisateur',
    example: 'Iantso123!',
  })
  newpassword: string;
}
