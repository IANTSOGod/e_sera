import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class JwtverifDto {
  @IsNotEmpty({ message: 'Id non vide' })
  @ApiProperty({ description: 'Id utilisateur', example: 'iagiy1HIavoqwj' })
  id: string;
}
