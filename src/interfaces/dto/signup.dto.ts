import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class Signupdto {
  @IsNotEmpty({ message: 'Username non vide' })
  username: string;
  @IsNotEmpty({ message: 'Email non vide' })
  @IsEmail({}, { message: 'Email non valide' })
  email: string;
  @IsNotEmpty({ message: 'Mot de passe non vide' })
  @MinLength(8, { message: 'Mot de passe trop court' })
  password: string;
}
