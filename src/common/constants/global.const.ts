export enum Locales {
  VI = 'vi',
  EN = 'en',
  JA = 'ja',
  KR = 'kr',
}

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

export const APP_LOCALES = [Locales.JA];

export enum ResponseType {
  Ok,
  Created,
}

export enum Encoding {
  SJIS = 'Shift_JIS',
  UTF8 = 'utf8',
}

export const ACCOUNT_STATUS_CODE = {
  UNPUBLISHED: 0,
  TEMPREGISTER: 1,
  OFFICIALREGISTER: 2,
  EXITMEMBERSHIP: 3,
  DELETED: 4,
};

export const ACCOUNT_STATUS_NAME = {
  [ACCOUNT_STATUS_CODE.UNPUBLISHED]: '未発行',
  [ACCOUNT_STATUS_CODE.TEMPREGISTER]: '仮登録',
  [ACCOUNT_STATUS_CODE.OFFICIALREGISTER]: '本登録',
  [ACCOUNT_STATUS_CODE.EXITMEMBERSHIP]: '脱退',
  [ACCOUNT_STATUS_CODE.DELETED]: '抹消',
};

export const SOURCE_STATUS_VALID = {
  [ACCOUNT_STATUS_CODE.TEMPREGISTER]: ACCOUNT_STATUS_CODE.UNPUBLISHED,
  [ACCOUNT_STATUS_CODE.EXITMEMBERSHIP]: ACCOUNT_STATUS_CODE.OFFICIALREGISTER,
  [ACCOUNT_STATUS_CODE.DELETED]: ACCOUNT_STATUS_CODE.UNPUBLISHED,
};

export const ACCOUNT_CODE_ARRAY = Object.values(ACCOUNT_STATUS_CODE);

export const ONE_DAY_TO_MS = 24 * 60 * 60 * 1000;

export const SORT_DIRECTION = ['ASC', 'DESC'];

export enum ErrorMessage {
  UNIQUE = 'duplicate key value violates unique constraint',
  QUERY_WRONG = 'Make sure your query is correct.',
  DATE_TIME_INVALID = 'date/time field value out of range',
  FAILING_ROW = 'Failing row contains',
}
export enum Roles {
  TEACHER = 1,
  STUDENT = 2,
  ADMIN = 3,
}

export enum RequestStatus {
  DRAFT = 1,
  REJECT_BY_OMC = 2,
  DONE = 3,
  DOING = 4,
}

const REGEX_JP_Phone_Number = {
  JP_PHONE_NUMBER_1: /^(?:(?:\+|0{0,2})81[- ]?)?0{0,1}[789]0[- ]?\d{4}[- ]?\d{4}$/,
  JP_PHONE_NUMBER_2: /^0\d{9,10}$/,
  JP_PHONE_NUMBER_3: /^0\d{1,3}-\d{1,4}-\d{4}$/,
  JP_PHONE_NUMBER_4: /^(070|080|090)-\d{4}-\d{4}$/,
  JP_PHONE_NUMBER_5: /^0120-\d{3}-\d{3}$/,
};

export const IS_PHONE_NUMBER = new RegExp(
  `(${Object.values(REGEX_JP_Phone_Number)
    .map((regex) => regex.source)
    .join('|')})`,
);

export const MAIL_DELAY = 1000;

export const DEFAULT_PAGINATION = {
  size: 20,
  page: 0,
};

export const QUERY_PARAM_PARSE = {
  false: false,
  true: true,
};

export const SEARCH_BY = {
  USER: ['id'],
  COMPANY: ['id', 'name'],
  CORPORATION: ['id', 'name'],
  CARD: ['code', 'name'],
  IMPORT_SYSTEM: ['fileName'],
  CONTRACT: ['id', 'name'],
};

export const ROMANJI_KANAKATA = {
  // (ei)
  A: 'エイ',
  // (bi-)
  B: 'ビー',
  //(shi-)
  C: 'シー',
  // (di-)
  D: 'ディー',
  // (i-)
  E: 'イー',
  //  (efu)
  F: 'エフ',
  // (ji-)
  G: 'ジー',
  // (eichi)
  H: 'エイチ',
  // (ai)
  I: 'アイ',
  // (jei)
  J: 'ジェイ',
  // (kei)
  K: 'ケイ',
  // (eru)
  L: 'エル',
  // (emu)
  M: 'エム',
  //  (enu)
  N: 'エヌ',
  // (o-)
  O: 'オー',
  // (pi-)
  P: 'ピー',
  // (kyu-)
  Q: 'キュー',
  // (a-ru)
  R: 'アール',
  // (esu)
  S: 'エス',
  // (ti-)
  T: 'ティー',
  //  (yu-)
  U: 'ユー',
  // (bui)
  V: 'ブイ',
  // (daburyu-)
  W: 'ダブリュー',
  // (ekkusu)
  X: 'エックス',
  // (wai)
  Y: 'ワイ',
  // (zetto)
  Z: 'ゼッド',
  '0': 'ゼロ',
  '1': 'いち',
  '2': 'に',
  '3': 'さん',
  '4': 'よん',
  '5': 'ご',
  '6': 'ろく',
  '7': 'なな',
  '8': 'はち',
  '9': 'きゅう',
};
