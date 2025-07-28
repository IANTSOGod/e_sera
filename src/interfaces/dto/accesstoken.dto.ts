import { IsNotEmpty } from 'class-validator';

export class Accesstokendto {
  @IsNotEmpty({ message: 'Token non null' })
  accesstoken: string;
}
