import { IsNotEmpty, ValidateNested } from 'class-validator';
import { MulterFile } from './profilephoto.dto';

export class Rattachphototopub {
  @IsNotEmpty({ message: 'Publication non vide' })
  pub_id: string;
  @ValidateNested()
  file: MulterFile;
}
