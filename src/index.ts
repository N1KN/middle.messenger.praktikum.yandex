import { AppContainer } from 'containers/app';
import { getAccountPageRender } from 'pages/account';
import { ChangePassword } from 'pages/change-password';
import { ChatsPage } from 'pages/chats';
import { InternalErrorPage } from 'pages/internal-error';
import { NotFoundPage } from 'pages/not-found';
import { SignInPage } from 'pages/sign-in';
import { SignUpPage } from 'pages/sign-up';
import { SiteMap } from 'pages/site-map';
import { getRouteByUrlOrNotFoundRoute, getUrlByRoute, RouteNames } from 'utils/router';

import './styles.pcss';

type PageFunction = (...props: any[]) => string;

(() => {
  const getPageByRouteName = (routeName: RouteNames): PageFunction => {
    const PAGES: Record<RouteNames, PageFunction> = {
      [RouteNames.ROOT_PAGE]: SiteMap,
      [RouteNames.SIGN_IN]: SignInPage,
      [RouteNames.SIGN_UP]: SignUpPage,
      [RouteNames.ACCOUNT]: getAccountPageRender(),
      [RouteNames.ACCOUNT_EDIT]: getAccountPageRender({ isEditMode: true }),
      [RouteNames.CHANGE_PASSWORD]: ChangePassword,
      [RouteNames.CHATS]: ChatsPage,
      [RouteNames.NOT_FOUND]: NotFoundPage,
      [RouteNames.INTERNAL_ERROR]: InternalErrorPage,
    };

    return PAGES[routeName];
  };

  const rootElement = document.querySelector('#root');
  const initialUrl = document.location.href;

  const renderPage = (url: string) => {
    // const isRoot = getHashUrlFromUrl(url) === '/';

    const routeName = getRouteByUrlOrNotFoundRoute(url);

    // Редирект на страницу входа.
    // if (isRoot) {
    //   location.hash = getUrlByRoute(RouteNames.SIGN_IN);
    //   return;
    // }

    // Редирект на страницу ошибки.
    if (!routeName) {
      location.hash = getUrlByRoute(RouteNames.NOT_FOUND);
      return;
    }

    if (!rootElement) {
      throw new Error(`Root element is not found`);
    }

    rootElement.innerHTML = AppContainer({
      page: getPageByRouteName(routeName)(),
    });
  };

  const handleRouting = (event: HashChangeEvent) => {
    renderPage(event.newURL);
  };

  document.addEventListener('DOMContentLoaded', () => renderPage(initialUrl), { once: true });
  window.addEventListener('hashchange', handleRouting);
})();

(() => {
  const isEl = function <T>(el: T): el is T & Omit<Element, 'attributes'> {
    return (el as unknown as Element)?.attributes !== undefined;
  };

  // Перехватываем и отключаем все события отправки(до следующего спринта)
  // TODO: Реализовать обработку событий отправки форм.
  document.addEventListener('submit', (e) => {
    e.stopPropagation();
    e.preventDefault();
    return false;
  });

  document.addEventListener('click', (e) => {
    if (isEl(e.target)) {
      //TODO: После подключения авторизации и событий убрать.
      // Переходим в чаты
      if (e.target.getAttribute('id') === 'authButton') {
        location.hash = getUrlByRoute(RouteNames.CHATS);
      }

      //TODO: После подключения авторизации и событий убрать.
      // Переходим в чаты
      if (e.target.getAttribute('id') === 'regButton') {
        location.hash = getUrlByRoute(RouteNames.CHATS);
      }

      //TODO: После подключения авторизации и событий убрать.
      // Переходим в данные об аккаунте
      if (e.target.getAttribute('id') === 'saveAccountButton') {
        location.hash = getUrlByRoute(RouteNames.ACCOUNT);
      }

      //TODO: После подключения авторизации и событий убрать.
      // Переходим в данные об аккаунте
      if (e.target.getAttribute('id') === 'savePasswordButton') {
        location.hash = getUrlByRoute(RouteNames.ACCOUNT);
      }
      e.stopPropagation();
      return false;
    }

    return false;
  });
})();
