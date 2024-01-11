export enum Locales {
  VI = 'vi',
  EN = 'en',
  JA = 'ja',
  KR = 'kr',
}

export const LIMIT_RECORD_DEFAULT = 8;
export const PAGE_DEFAULT = 1;

export enum LocalesFullText {
  VI = 'Vietnamese',
  EN = 'English',
  JA = 'Japanese',
  KR = 'Korean',
}

export const CARD_CODE = 10;
export enum MinLengthId {
  CORPORATION = 3,
  COMPANY = 5,
}

export const APP_LOCALES = [Locales.EN];

export enum ResponseType {
  Ok,
  Created,
}

export enum Encoding {
  SJIS = 'Shift_JIS',
  UTF8 = 'utf8',
}

export const ONE_DAY_TO_MS = 24 * 60 * 60 * 1000;

export const SORT_DIRECTION = ['ASC', 'DESC'];

export enum ErrorMessage {
  UNIQUE = 'duplicate key error collection',
  QUERY_WRONG = 'Make sure your query is correct.',
  DATE_TIME_INVALID = 'date/time field value out of range',
  FAILING_ROW = 'Failing row contains',
}
export enum Roles {
  TEACHER = 1,
  STUDENT = 2,
  ADMIN = 3,
}

export enum TokenType {
  CONFIRM_REGISTRATION = 'register',
  CONFIRM_FORGOT_PASSWORD = 'password',
}

export enum ACCOUNT_STATUS_CODE {
  TEMPREGISTER,
  UNPUBLISHED,
  PUBLISHED,
};

export const CLOUDINARY = 'Cloudinary';

export enum RequestStatus {
  DRAFT = 1,
  REJECT_BY_OMC = 2,
  DONE = 3,
  DOING = 4,
}
export const REGEX = {
  USERNAME: /^[\d\w]+$/,
  PHONE_NUMBER: /^[0-9]{10}$/,
};

export const DEFAULT_AVATAR = 'https://res.cloudinary.com/dzq6nfkra/image/upload/v1704822124/avatar/defaut-avatar.jpg';

export const MAIL_DELAY = 1000;

export const DEFAULT_PAGINATION = {
  size: 8,
  page: 0,
};

export const QUERY_PARAM_PARSE = {
  false: false,
  true: true,
};
