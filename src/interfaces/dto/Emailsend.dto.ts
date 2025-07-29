import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class EmailsendDto {
  @IsNotEmpty({ message: 'Destination non null' })
  @IsEmail({}, { message: 'Destinataire non valide' })
  @ApiProperty({ description: 'Destinataire email', example: 'test@gmail.com' })
  to: string;
  @IsNotEmpty({ message: 'Sujet non null' })
  @ApiProperty({ description: 'Titre d email envoyé' })
  subject: string;
  @ApiPropertyOptional({
    description: 'Texte facultatif a envoyé',
    example: 'Bonjour depuis e_sera',
  })
  text?: string;
  @ApiPropertyOptional({
    description: 'Html a envoyé',
    example: '<div>bonjou</div>',
  })
  html?: string;
}
