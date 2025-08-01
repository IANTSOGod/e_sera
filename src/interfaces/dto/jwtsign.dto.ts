import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class Jwtsigndto {
  @IsNotEmpty({ message: 'Email non vide' })
  @IsEmail({}, { message: 'Email non valide' })
  @ApiProperty({
    description: 'Email a vérifié',
    example: 'iantsochristianrazafindrazaka@gmail.com',
  })
  email: string;
}
