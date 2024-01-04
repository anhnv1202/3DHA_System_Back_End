import { EntityManager, EntityTarget, Repository } from 'typeorm';
import { Pagination } from './filter.interface';
import { StreamableFile } from '@nestjs/common';
import { User } from '#entities/user.entity';
import type { Response } from 'express';

export interface FindAndCountQuery {
  pagination: Pagination;
  relations?: string[];
  searchBy?: string[];
  entityManager?: EntityManager;
  entity?: EntityTarget<any>;
}

export interface ValidateUniqueEntity<T, DTO> {
  next: DTO;
  repository: Repository<T>;
  id: number;
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

export interface BatchResult {
  total: number;
  errors: Array<{ name: string; error: string }>;
}
