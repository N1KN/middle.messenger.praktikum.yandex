import { getHashUrlFromUrl } from 'utils/common';
export enum RouteNames {
    SIGN_IN = 'sign-in',
    REGISTER = 'register',
    ACCOUNT = 'account',
    ACCOUNT_EDIT = 'account-edit',
    CHANGE_PASSWORD = 'change-password',
    CHATS = 'chats',
    NOT_FOUND = 'not-found',
    INTERNAL_ERROR = 'internal-error',
}

export const paths: Record<RouteNames, string> = {
    [RouteNames.SIGN_IN]: 'sign-in',
    [RouteNames.REGISTER]: 'register',
    [RouteNames.ACCOUNT]: 'account',
    [RouteNames.ACCOUNT_EDIT]: 'account-edit',
    [RouteNames.CHANGE_PASSWORD]: 'change-password',
    [RouteNames.CHATS]: 'chats',
    [RouteNames.NOT_FOUND]: 'not-found',
    [RouteNames.INTERNAL_ERROR]: 'internal-error',
} as const;

export const getUrlByRoute = (route: RouteNames): string => {
    return `/#/${paths[route]}`
}

export const getRouteByUrl = (url: string): RouteNames => {
    // Очищаем url от части "/#/"
    const clearUrl = getHashUrlFromUrl(url).slice(1);

    const routeName = (Object.entries(paths) as [RouteNames, string][]).find(([id, path]) => path === clearUrl);

    return routeName?.[0] ?? RouteNames.NOT_FOUND;
}