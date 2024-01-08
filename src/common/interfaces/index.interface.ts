// import { EntityManager, EntityTarget, Repository } from 'typeorm';
import { User } from '@models/user.model';
import { StreamableFile } from '@nestjs/common';
import type { Response } from 'express';

// export interface FindAndCountQuery {
//   pagination: Pagination;
//   relations?: string[];
//   searchBy?: string[];
//   entityManager?: EntityManager;
//   entity?: EntityTarget<any>;
// }

export interface FileExport {
  file: StreamableFile;
  headers: { [key: string]: string };
}

export interface ExportUserInfoPDF<T> {
  body: T;
  res: Response;
  user: User;
}

export interface BatchResult {
  total: number;
  errors: Array<{ name: string; error: string }>;
}
