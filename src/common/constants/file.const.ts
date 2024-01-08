import { getUserTokenByRequest } from '@guards/guard.helper';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { Request } from 'express';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { extname, join } from 'path';

export const BASE_DIRECTORY = 'document';
export const ZIP_DIRECTORY = 'document/zip';
export const SYSTEM_IMPORT_DIRECTORY = `${BASE_DIRECTORY}/system-import`;
export const USER_RESULT_DIRECTORY = `${BASE_DIRECTORY}/user-info`;
export const USER_RESULT_FILE = `${USER_RESULT_DIRECTORY}/index.pdf`;
const LIMIT_FILE_SIZE = 5; /** (MB) */

interface Config {
  customName?: string;
  limit?: number;
  file?: number;
}

export const MULTER_OPTION = (
  path: string,
  config: Config = { customName: '', limit: LIMIT_FILE_SIZE },
): MulterOptions => {
  const multerOption: MulterOptions = {
    storage: diskStorage({
      destination: (_: Request, __: any, cb: (e, name) => void) => {
        const uploadPath = join(process.cwd(), path);
        if (!existsSync(uploadPath)) {
          mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
      },
      filename: (req: Request, file: Express.Multer.File, cb: (e, name) => void) => {
        const user = getUserTokenByRequest(req);
        file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
        const name = config.customName
          ? `${config.customName}${extname(file.originalname)}`
          : generateFileName(user?.id, file.originalname);
        cb(null, name);
      },
    }),
    fileFilter,
    limits: {
      files: 1,
      fileSize: config.limit * 1024 * 1024,
    },
  };

  return multerOption;
};

export const MULTI_MULTER_OPTION = (path = SYSTEM_IMPORT_DIRECTORY): MulterOptions => {
  const multerOption: MulterOptions = {
    storage: diskStorage({
      destination: (_: Request, __: any, cb: (e, name) => void) => {
        const uploadPath = join(process.cwd(), path);
        if (!existsSync(uploadPath)) {
          mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
      },
      filename: (_: Request, file: Express.Multer.File, cb: (_, __) => void) => {
        file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
        cb(null, file.originalname);
      },
    }),
    fileFilter,
    // limits: {
    //   files: 1,
    //   fileSize: config.limit * 1024 * 1024,
    // },
  };

  return multerOption;
};

function fileFilter(_: Request, file: Express.Multer.File, callback: (e, name) => void) {
  // const ext = extname(file.originalname).toLowerCase();
  // if (!['.tmx'].includes(ext)) {
  //   return callback(new Error('Only file with extensions .tmx are allowed'), false);
  // }
  callback(null, true);
}

function generateFileName(userId: string, name: string): string {
  return `${new Date().getTime()}_${userId}_${name}`;
}

export const apiBody = {
  schema: {
    type: 'object',
    properties: {
      file: {
        type: 'string',
        format: 'binary',
      },
    },
  },
};

export const SYSTEM_IMPORT = {
  schema: {
    type: 'object',
    properties: {
      files: {
        type: 'array',
        format: 'binary',
      },
    },
  },
};

export const MIME_TYPE = {
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.pdf': 'application/pdf',
  '.zip': 'application/zip',
  '.csv': 'text/csv',
};

export function getMimeType(ext: string): string {
  return MIME_TYPE[ext] || 'application/pdf';
}

export function fileHeader(path: string, name?: string) {
  const ext = extname(path);
  const urlName = name || path.split('/').at(-1).replace(ext, '');
  return {
    'Character-Encoding': 'UTF-8',
    'Content-Type': getMimeType(ext),
    'Content-Disposition': `attachment; filename=${encodeURIComponent(urlName)}`,
    'File-Name': encodeURIComponent(urlName),
    'Access-Control-Expose-Headers': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Accept, Authorization',
  };
}
