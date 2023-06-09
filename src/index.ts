import { RouteNames } from 'constants/router';
import { Block, IBlockProps } from 'lib/block';
import { AccountPage } from 'pages/account';
import { ChangePassword } from 'pages/change-password';
import { ChatsPage } from 'pages/chats';
import { InternalErrorPage } from 'pages/internal-error';
import { NotFoundPage } from 'pages/not-found';
import { SignInPage } from 'pages/sign-in';
import { SignUpPage } from 'pages/sign-up';
import { SiteMap } from 'pages/site-map';
import { getRouteByUrlOrNotFoundRoute, getUrlByRoute, RouterInstance } from 'utils/router';
import { AuthControllerInstance } from './controllers';

import './styles.pcss';
import { store } from './store';

(() => {
  // @ts-ignore
  window.EVENTS_ON_ELEMENT = [];

  const PAGES: Record<RouteNames, { component: typeof Block<IBlockProps<any>>; props: any }> = {
    [RouteNames.ROOT_PAGE]: { component: SignInPage, props: {} },
    [RouteNames.SIGN_IN]: { component: SignInPage, props: {} },
    [RouteNames.SIGN_UP]: { component: SignUpPage, props: {} },
    [RouteNames.SITE_MAP]: { component: SiteMap, props: {} },
    [RouteNames.ACCOUNT]: { component: AccountPage, props: {} },
    [RouteNames.ACCOUNT_EDIT]: { component: AccountPage, props: { isEditMode: true } },
    [RouteNames.CHANGE_PASSWORD]: { component: ChangePassword, props: {} },
    [RouteNames.CHATS]: { component: ChatsPage, props: {} },
    [RouteNames.NOT_FOUND]: { component: NotFoundPage, props: {} },
    [RouteNames.INTERNAL_ERROR]: { component: InternalErrorPage, props: {} },
  };

  const protectedRoutes = (Object.keys(PAGES) as RouteNames[]).filter(
    (route) =>
      ![RouteNames.SIGN_UP, RouteNames.SIGN_IN, RouteNames.NOT_FOUND, RouteNames.INTERNAL_ERROR].includes(route),
  );

  Object.entries(PAGES).forEach(([routeName, { component, props }]) => {
    RouterInstance.use(getUrlByRoute(routeName as RouteNames), component, props);
  });

  RouterInstance.useAsNotFoundRoute(getUrlByRoute(RouteNames.NOT_FOUND), NotFoundPage, {});

  document.addEventListener(
    'DOMContentLoaded',
    () => {
      RouterInstance.start();

      // @ts-ignore
      window._RI = RouterInstance;

      store.subscribe((state) => {
        const { isLoggedIn, authChecked } = state.auth;

        if (authChecked) {
          const route = getRouteByUrlOrNotFoundRoute(window.location.pathname, true);

          if (protectedRoutes.includes(route) && !isLoggedIn) {
            setTimeout(() => RouterInstance.goByRouteName(RouteNames.ROOT_PAGE), 1);
          }
        }
      });

      setTimeout(() => AuthControllerInstance.getUserInfo(), 1);
    },
    { once: true },
  );
})();

(() => {
  const isAnchorEl = function <T>(el: T): el is T & Omit<Element, 'attributes' | 'tagName'> {
    return (el as unknown as Element)?.attributes !== undefined && (el as unknown as Element).tagName === 'A';
  };

  // Перехватываем и отключаем все события отправки(до следующего спринта)
  // document.addEventListener('submit', (e) => {
  // e.stopPropagation();
  // e.preventDefault();
  // return false;
  // });

  document.addEventListener('click', function (event) {
    const target = event.target as HTMLAnchorElement;

    if (isAnchorEl(target)) {
      event.preventDefault();
      event.stopPropagation();

      RouterInstance.go(target.getAttribute('href') || '/');
    }
  });
})();
