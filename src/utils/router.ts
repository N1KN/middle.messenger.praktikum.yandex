export enum RouteNames {
    SIGN_IN = 'sign-in',
    SIGN_UP = 'sign-up',
    ACCOUNT = 'account',
    ACCOUNT_EDIT = 'account-edit',
    CHANGE_PASSWORD = 'change-password',
    CHATS = 'chats',
    NOT_FOUND = 'not-found',
    INTERNAL_ERROR = 'internal-error',
}

export const SITE_PATHS: Record<RouteNames, string> = {
    [RouteNames.SIGN_IN]: 'sign-in',
    [RouteNames.SIGN_UP]: 'sign-up',
    [RouteNames.ACCOUNT]: 'account',
    [RouteNames.ACCOUNT_EDIT]: 'account-edit',
    [RouteNames.CHANGE_PASSWORD]: 'change-password',
    [RouteNames.CHATS]: 'chats',
    [RouteNames.NOT_FOUND]: 'not-found',
    [RouteNames.INTERNAL_ERROR]: 'internal-error',
} as const;

export const getUrlByRoute = (route: RouteNames, withFirstSlash?: boolean): string => {
    return `${withFirstSlash ? '/' : ''}#/${SITE_PATHS[route]}`
}

export const getHashUrlFromUrl = (url: string): string => {
    try {
        const urlObj = new URL(url);

        // Очищаем hash url от #
        return urlObj.hash.slice(1);
    } catch (e) {
        return '';
    }
};

export function getRouteByUrlOrNotFoundRoute(url: string, notFoundRoteByDefault: true): RouteNames;
export function getRouteByUrlOrNotFoundRoute(url: string, notFoundRoteByDefault?: false): RouteNames | undefined;
export function getRouteByUrlOrNotFoundRoute(url: string, notFoundRoteByDefault: boolean = false): RouteNames | undefined {
    // Очищаем url от части "#/"
    const clearUrl = getHashUrlFromUrl(url).slice(1);

    const routeName = (Object.entries(SITE_PATHS) as [RouteNames, string][]).find(([_, path]) => path === clearUrl);

    if (notFoundRoteByDefault) {
        return routeName?.[0] ?? RouteNames.NOT_FOUND;
    }

    return routeName?.[0];
}