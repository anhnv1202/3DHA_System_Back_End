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

export const SORT_DIRECTION = ['asc', 'desc'];

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

export enum Answer {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
}

export enum Level {
  Beginner = '1',
  Intermediate = '2',
  Expert = '3',
  All = '4',
}

export const ROLE_NORMAL = [Roles.STUDENT, Roles.TEACHER];
export const ROLE_ARRAY = [Roles.STUDENT, Roles.TEACHER, Roles.ADMIN];

export const TEN_MINUTES = 10 * 60 * 1000;

export enum TokenType {
  CONFIRM_REGISTRATION = 'register',
  CONFIRM_FORGOT_PASSWORD = 'password',
}

export enum ACCOUNT_STATUS_CODE {
  TEMPREGISTER,
  UNPUBLISHED,
  PUBLISHED,
}

export const CLOUDINARY = 'Cloudinary';

export enum RequestStatus {
  DRAFT = 1,
  REJECT_BY_OMC = 2,
  DONE = 3,
  DOING = 4,
}
export const REGEX = {
  USERNAME: /^[\d\w]{6,40}$/,
  PHONE_NUMBER: /^[0-9]{10}$/,
  PASSWORD: /^.{8,16}$/,
};

export const CLOUDINARY_PRODUCT_IMG = 'product-image';
export const CLOUDINARY_USER_AVATAR_IMG = 'user-avatar-image';

export const DEFAULT_AVATAR = 'https://res.cloudinary.com/dzq6nfkra/image/upload/v1704822124/avatar/defaut-avatar.jpg';
export const DEFAULT_THUMB_COURSE =
  'https://res.cloudinary.com/dzq6nfkra/image/upload/v1704822124/avatar/defaut-avatar.jpg';

export const MAIL_DELAY = 1000;

export const DEFAULT_PAGINATION = {
  size: 8,
  page: 1,
};

export const QUERY_PARAM_PARSE = {
  false: false,
  true: true,
};

export const SEARCH_BY = {
  USER: ['name', 'role'],
  MAJOR: ['title'],
  COURSE: ['name', 'major', 'author'],
  QUESTION: ['detail'],
  QUIZZ: ['name'],
  OUTCOME_LIST: ['user'],
  CHAPTER: ['title'],
};
