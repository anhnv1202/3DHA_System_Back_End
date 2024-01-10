import { CLOUDINARY } from '@common/constants/global.const';
import { Provider } from '@nestjs/common';
import { v2 } from 'cloudinary';

export const CloudinaryProvider: Provider = {
  provide: CLOUDINARY,
  useFactory: (): typeof v2 => {
    return v2.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_KEY,
      api_secret: process.env.CLOUDINARY_SECRET,
    }) as typeof v2;
  },
};
