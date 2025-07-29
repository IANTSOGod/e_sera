import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class OtpSendDto {
  @IsNotEmpty({ message: 'Email non vide' })
  @IsEmail({}, { message: 'Email non valide' })
  @ApiProperty({
    description: 'Email a qui envoyé un code',
    example: 'iantsochristianrazafindrazaka@gmail.com',
  })
  email: string;
}
