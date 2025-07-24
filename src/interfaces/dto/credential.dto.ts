import { IsNotEmpty } from 'class-validator';

export class Credentialdto {
  @IsNotEmpty({ message: 'Email non vide' })
  email: string;
  @IsNotEmpty({ message: 'Username non null' })
  username: string;
  @IsNotEmpty({ message: 'Photo non null' })
  photolink: string;
}
