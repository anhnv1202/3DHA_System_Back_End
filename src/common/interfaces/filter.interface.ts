import { Roles } from '#common/constants/global.const';

export interface PaginationResult<T> {
  total: number;
  data: T[];
}

export interface Pagination {
  page: number;
  size: number;
  text: string;
  sortBy: string;
  sortType: 'ASC' | 'DESC';
  [key: string]: string | number | Roles[];
}
