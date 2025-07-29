import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class OtpVerificationDto {
  @IsNotEmpty({ message: 'Otp non null' })
  @Length(6, 6, { message: 'Otp invalide' })
  @ApiProperty({ description: 'Otp a vérifié', example: '123456' })
  otp: string;
  @IsNotEmpty({ message: 'Email non null' })
  @IsEmail({}, { message: 'Email invalide' })
  @ApiProperty({ description: 'Email du possesseur otp' })
  email: string;
}
