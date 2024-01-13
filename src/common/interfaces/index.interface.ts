// import { EntityManager, EntityTarget, Repository } from 'typeorm';
import { User } from '@models/user.model';
import { StreamableFile } from '@nestjs/common';
import type { Response } from 'express';
import { IPopulate } from 'src/base/base.repository';
import { Pagination } from './filter.interface';

export interface FindAndCountQuery {
  pagination: Pagination;
  populates?: IPopulate[];
  searchBy?: string[];
}

export interface FileExport {
  file: StreamableFile;
  headers: { [key: string]: string };
}

export interface ExportUserInfoPDF<T> {
  body: T;
  res: Response;
  user: User;
}

