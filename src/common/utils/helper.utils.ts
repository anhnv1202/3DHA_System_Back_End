import { DEFAULT_PAGINATION, QUERY_PARAM_PARSE } from '@common/constants/global.const';
import { Pagination } from '@common/interfaces/filter.interface';
import LogService from 'src/config/log.service';
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

export const getPublicIdFromUrl = (publicUrl: string): string | null => {
  const parts = publicUrl.split('/');
  const filename = parts[parts.length - 1];

  const filenameParts = filename.split('.');
  if (filenameParts.length === 2) {
    return filenameParts[0];
  }

  return null;
};

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

export const isNullOrUndefined = (value: any): boolean => value === null || value === undefined || value === '';

export const isStrEmpty = (value: any): boolean => isNullOrUndefined(value) || value.trim() === '';

export const isArrayNonEmpty = (value: any): boolean => !!(value && Array.isArray(value) && value.length);

export const mapToArray = (data: any) => {
  return Array.isArray(data) ? data : [data];
};

export const convertStringToDate = (str: string): Date => {
  const covertDate = `${str.slice(0, 4)}-${str.slice(4, 6)}-${str.slice(6, 8)}T${str.slice(9, 11)}:${str.slice(
    11,
    13,
  )}:${str.slice(13, 15)}.000Z`;
  return new Date(covertDate);
};

export const convertDate = (date: Date): string => {
  const stringDate = new Date(date).toISOString();
  return stringDate.split('-').join('').split(':').join('').split('.')[0] + 'Z';
};

export const isTwoObjectsEqual = (object1: any, object2: any) => {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);
  if (keys1.length !== keys2.length) {
    return false;
  }
  for (const key of keys1) {
    const val1 = object1[key];
    const val2 = object2[key];
    const areObjects = isObject(val1) && isObject(val2);
    if ((areObjects && !isTwoObjectsEqual(val1, val2)) || (!areObjects && val1 !== val2)) {
      return false;
    }
  }
  return true;
};

export const isObject = (object: any) => object && typeof object === 'object';

export const filterUndefinedObjectField = (object: any) => {
  const validKeys = Object.keys(object).filter((key) => !isNullOrUndefined(object[key]));
  let result = {};
  validKeys.forEach((key) => {
    result = { ...result, [key]: object[key] };
  });
  return result;
};

export const convertToMappingObject = (array: any, key: string) => {
  return Object.assign(
    {},
    ...array.map((item) => ({
      [item[key].toString()]: item,
    })),
  );
};

export const convertToMappingObjectArray = (array: any, key: string) => {
  const result = {};
  array.forEach((item) => {
    result[item[key]] ? result[item[key]].push(item) : (result[item[key]] = [item]);
  });

  return result;
};

export const isObjectIdEqual = (o1: any, o2: any) => o1?.toString() === o2?.toString();

export const dateDiff = (date1: Date, date2: Date) => date1.getTime() - date2.getTime();

export const getAccountByRawData = (item) => item[2]?.split(' ')[0];

export const ItemNotFoundMessage = (item: string) => i18n.__('item-not-found', i18n.__(item));
