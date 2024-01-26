import { getFileId } from '@common/utils/helper.utils';
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { GoogleDriveService } from 'nestjs-google-drive';
import * as path from 'path';

@Injectable()
export class FileService {
  constructor(private readonly googleDriveService: GoogleDriveService) {}

  async uploadToGoogleDrive(file: Express.Multer.File, folder: string): Promise<string> {
    const tempFilePath = path.join(__dirname, file.originalname);
    fs.writeFileSync(tempFilePath, file.buffer);
    file.filename = file.originalname;
    file.path = tempFilePath;
    const fileUrl = await this.googleDriveService.uploadFile(file, folder);
    fs.unlinkSync(tempFilePath);

    return getFileId(fileUrl);
  }

  async deleteFileGoogleDrive(fileId: string): Promise<void> {
    return await this.googleDriveService.deleteFile(fileId);
  }
}
