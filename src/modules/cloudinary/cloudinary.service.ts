import { getPublicIdFromUrl } from '@common/utils/helper.utils';
import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiOptions, UploadApiResponse, v2 } from 'cloudinary';
import toStream = require('buffer-to-stream');

@Injectable()
export class CloudinaryService {
  async uploadImage(
    file: Express.Multer.File | string, // Modified to accept either a file or a base64 string
    folder?: string,
  ): Promise<{ result: UploadApiResponse | UploadApiErrorResponse; imageUrl?: string; publicId?: string }> {
    if (typeof file === 'string') {
      return this.uploadBase64Image(file, folder);
    } else {
      return this.uploadFile(file, folder);
    }
  }

  async uploadVideo(
    file: Express.Multer.File,
    folder?: string,
  ): Promise<{ result: UploadApiResponse | UploadApiErrorResponse; imageUrl?: string; publicId?: string }> {
    return this.uploadFile(file, folder, { resource_type: 'video' });
  }

  async deleteFile(publicUrl: string, folder?: string): Promise<any> {
    const publicId = getPublicIdFromUrl(publicUrl);
    return v2.uploader.destroy(folder ? `${folder}/${publicId}` : publicId);
  }

  private async uploadFile(
    file: Express.Multer.File,
    folder?: string,
    options?: UploadApiOptions,
  ): Promise<{ result: UploadApiResponse | UploadApiErrorResponse; imageUrl?: string; publicId?: string }> {
    const uploadOptions: UploadApiOptions = {
      ...options,
      folder: folder || '',
    };

    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(uploadOptions, (error, result) => {
        if (error) return reject(error);
        const publicId = result.public_id;
        const imageUrl = result.secure_url;
        resolve({ result, imageUrl, publicId });
      });
      toStream(file.buffer).pipe(upload);
    });
  }

  private async uploadBase64Image(
    base64String: string,
    folder?: string,
  ): Promise<{ result: UploadApiResponse | UploadApiErrorResponse; imageUrl?: string; publicId?: string }> {
    const uploadOptions: UploadApiOptions = {
      folder: folder || '',
    };

    return new Promise((resolve, reject) => {
      v2.uploader.upload(base64String, uploadOptions, (error, result) => {
        if (error) return reject(error);
        const publicId = result.public_id;
        const imageUrl = result.secure_url;
        resolve({ result, imageUrl, publicId });
      });
    });
  }
}
