import { IsEmail, IsNotEmpty } from 'class-validator';

export class EmailsendDto {
  @IsNotEmpty({ message: 'Destination non null' })
  @IsEmail({}, { message: 'Destinataire non valide' })
  to: string;
  @IsNotEmpty({ message: 'Sujet non null' })
  subject: string;
  text?: string;
  html?: string;
}
