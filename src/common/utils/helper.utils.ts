import { FindAndCountQuery, ValidateUniqueEntity } from '#common/interfaces/index.interface';
import LogService from 'src/config/log.service';
import { Brackets, FindOptionsWhere, SelectQueryBuilder } from 'typeorm';
import * as i18n from 'i18n';
import { DEFAULT_PAGINATION, QUERY_PARAM_PARSE } from '#common/constants/global.const';
import { Pagination } from '#common/interfaces/filter.interface';
import { InternalServerErrorException } from '@nestjs/common';

export function handleLogError(error: any) {
  if (process.env.NODE_ENV === 'production') {
    LogService.logErrorFile(JSON.stringify(error));
  } else {
    LogService.logError('STACK', error.stack);
    LogService.logError('PATH', error.path);
    LogService.logError('BODY REQUEST', JSON.stringify(error?.body)?.slice(0, 500) + '...');
  }
}

export function handleLogInfo(info: any) {
  if (process.env.NODE_ENV === 'production') {
    LogService.logInfoFile(info);
  } else {
    LogService.logInfo(info);
  }
}

export function convertQueryParam(query: any): { [key: string]: string } {
  const parseQueries = {};

  Object.keys(query).forEach((key) => {
    if (['', 'undefined', 'NaN', 'null'].includes(query[key])) return;

    const array = (query[key] as string).split(',');

    if (array.length > 1) {
      parseQueries[key] = array;
      return;
    }

    parseQueries[key] = QUERY_PARAM_PARSE[query[key]] ?? query[key];
  });

  return parseQueries;
}

export function getPagination(request: { query: unknown }): Pagination {
  const query = convertQueryParam(request.query);
  const paginationParams = {
    ...DEFAULT_PAGINATION,
    ...query,
  } as Pagination;
  return paginationParams;
}

export async function findAndCount<T>(params: FindAndCountQuery): Promise<[T[], number]> {
  try {
    const { pagination, relations, searchBy = [], entityManager, entity } = params;
    const { size, page, sortBy, sortType, text, ...rest } = pagination;

    const repository = entityManager.getRepository(entity);
    const columns = repository.metadata.columns.map((i) => i.propertyName);

    let query: SelectQueryBuilder<T> = repository.createQueryBuilder('entity');

    if (relations && relations.length > 0) {
      for (const relation of relations) {
        query = query.leftJoinAndSelect(`entity.${relation}`, relation);
      }
    }

    query = query.where((qb) => {
      if (text && searchBy.length > 0) {
        const textConditions = searchBy.map((key) => `entity.${key} ILIKE :text`);
        qb.andWhere(new Brackets((subQb) => subQb.where(textConditions.join(' OR '), { text: `%${text}%` })));
      }

      if (Object.keys(rest).length > 0) {
        Object.keys(rest).forEach((key) => {
          if (!columns.includes(key)) return;

          if (key === 'role' && Array.isArray(rest[key])) {
            qb.andWhere(`entity.role In (:...roles)`, { roles: rest[key] });
            return;
          }

          if (Array.isArray(rest[key])) {
            qb.andWhere(`entity.${key} In (:...values)`, { values: rest[key] });
            return;
          }

          qb.andWhere(`entity.${key} = :${key}`, { [key]: rest[key] });
        });
      }
    });

    if (sortBy && sortType) {
      const [relation, column] = sortBy.split('.');
      const isSortRelation = column && relations.includes(relation);
      const entity = isSortRelation ? `${sortBy}` : `entity.${sortBy}`;
      query = query.orderBy(entity, (sortType as any).toUpperCase(), 'NULLS FIRST');
    }

    if (!Number(page)) {
      const [data, total] = await query.getManyAndCount();
      return [data, total];
    }

    const [data, total] = await query
      .skip((Number(page) - 1) * Number(size))
      .take(Number(size))
      .getManyAndCount();

    return [data, total];
  } catch (e) {
    LogService.logInfo(e);
    throw new InternalServerErrorException(e);
  }
}

export async function validateUniqueEntity<R, DTO>(params: ValidateUniqueEntity<R, DTO>): Promise<string> {
  const { next, repository, id } = params;
  const record: R | null = await repository.findOne({ where: convertToMultiObject(next) });
  if (!record || record?.['id'] === id) return '';

  let error: string;
  Object.keys(next).forEach((key) => {
    if (error) return;
    if ([null, undefined, '', 0].includes(next[key])) return;
    if (String(next[key]) === String(record[key])) error = key;
  });

  return i18n.__('update-check-same-property', { key: error });
}

export function convertToMultiObject<T>(object: unknown): FindOptionsWhere<T>[] {
  const res = [];
  Object.keys(object).forEach((key) => {
    if ([null, undefined, ''].includes(object[key])) return;
    res.push({ [key]: object[key] });
  });
  return res;
}

export const ItemNotFoundMessage = (item: string) => i18n.__('item-not-found', i18n.__(item));
