export enum RouteNames {
  ROOT_PAGE = 'ROOT_PAGE',
  SIGN_IN = 'sign-in',
  SIGN_UP = 'sign-up',
  SITE_MAP = 'site-map',
  ACCOUNT = 'account',
  ACCOUNT_EDIT = 'account-edit',
  CHANGE_PASSWORD = 'change-password',
  CHATS = 'chats',
  NOT_FOUND = 'not-found',
  INTERNAL_ERROR = 'internal-error',
}

export const SITE_PATHS: Record<RouteNames, string> = {
  [RouteNames.ROOT_PAGE]: '',
  [RouteNames.SIGN_IN]: 'sign-in',
  [RouteNames.SITE_MAP]: 'site-map',
  [RouteNames.SIGN_UP]: 'sign-up',
  [RouteNames.ACCOUNT]: 'account',
  [RouteNames.ACCOUNT_EDIT]: 'account-edit',
  [RouteNames.CHANGE_PASSWORD]: 'change-password',
  [RouteNames.CHATS]: 'chats',
  [RouteNames.NOT_FOUND]: 'not-found',
  [RouteNames.INTERNAL_ERROR]: 'internal-error',
} as const;
