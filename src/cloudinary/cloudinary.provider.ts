// cloudinary.provider.ts
import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

export const CLOUDINARY = 'CLOUDINARY';

export const CloudinaryProvider: Provider = {
  provide: CLOUDINARY,
  useFactory: (config: ConfigService) => {
    const url = config.get<string>('CLOUDINARY_URL');
    if (url) {
      cloudinary.config({ url });
    }
    return cloudinary;
  },
  inject: [ConfigService],
};
