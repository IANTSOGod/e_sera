import { IsEmail, IsNotEmpty } from 'class-validator';

export class Jwtsigndto {
  @IsNotEmpty({ message: 'Email non vide' })
  @IsEmail({}, { message: 'Email non valide' })
  email: string;
}
