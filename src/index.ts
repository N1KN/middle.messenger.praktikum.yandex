import { AppContainer } from 'containers/app';
import { Block, IBlockProps } from 'lib/block';
import { AccountPage } from 'pages/account';
import { ChangePassword } from 'pages/change-password';
import { ChatsPage } from 'pages/chats';
import { InternalErrorPage } from 'pages/internal-error';
import { NotFoundPage } from 'pages/not-found';
import { SignInPage } from 'pages/sign-in';
import { SignUpPage } from 'pages/sign-up';
import { SiteMap } from 'pages/site-map';
import { getRouteByUrlOrNotFoundRoute, getUrlByRoute, RouteNames } from 'utils/router';

import './styles.pcss';

(() => {
  // @ts-ignore
  window.EVENTS_ON_ELEMENT = [];

  const getPageByRouteName = (routeName: RouteNames): Block => {
    const PAGES: Record<RouteNames, { component: typeof Block<IBlockProps<any>>; props: any }> = {
      [RouteNames.ROOT_PAGE]: { component: SiteMap, props: {} },
      [RouteNames.SIGN_IN]: { component: SignInPage, props: {} },
      [RouteNames.SIGN_UP]: { component: SignUpPage, props: {} },
      [RouteNames.ACCOUNT]: { component: AccountPage, props: {} },
      [RouteNames.ACCOUNT_EDIT]: { component: AccountPage, props: { isEditMode: true } },
      [RouteNames.CHANGE_PASSWORD]: { component: ChangePassword, props: {} },
      [RouteNames.CHATS]: { component: ChatsPage, props: {} },
      [RouteNames.NOT_FOUND]: { component: NotFoundPage, props: {} },
      [RouteNames.INTERNAL_ERROR]: { component: InternalErrorPage, props: {} },
    };

    const { props, component: Component } = PAGES[routeName];
    return new Component(props);
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

    const pageComp = getPageByRouteName(routeName);

    const appContainerBlock = new AppContainer({
      page: pageComp,
    });

    rootElement.replaceChildren(appContainerBlock.getContent());
    appContainerBlock.emitComponentDidMount();
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
