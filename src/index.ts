import { AppContainer } from 'containers/app';
import { getRouteByUrlOrNotFoundRoute, getUrlByRoute, RouteNames } from 'utils/router';
import { NotFoundPage } from 'pages/not-found';
import { InternalErrorPage } from 'pages/internal-error';
import { SignInPage } from 'pages/sign-in';
import { SignUpPage } from 'pages/sign-up';
import { AccountPage } from 'pages/account';
import './styles.css';

type PageFunction = (...props: any[]) => string;

(() => {
    const getPageByRouteName = (routeName: RouteNames): PageFunction => {
        const PAGES: Record<RouteNames, PageFunction> = {
            [RouteNames.SIGN_IN]: SignInPage,
            [RouteNames.SIGN_UP]: SignUpPage,
            [RouteNames.ACCOUNT]: AccountPage,
            [RouteNames.ACCOUNT_EDIT]: () => 'WIP',
            [RouteNames.CHANGE_PASSWORD]: () => 'WIP',
            [RouteNames.CHATS]: () => 'WIP',
            [RouteNames.NOT_FOUND]: NotFoundPage,
            [RouteNames.INTERNAL_ERROR]: InternalErrorPage,
        }

        return PAGES[routeName];
    }

    const rootElement = document.querySelector('#root');
    const initialUrl = document.location.href;

    const renderPage = (url: string) => {
        const routeName = getRouteByUrlOrNotFoundRoute(url);

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
        renderPage(event.newURL)
    };

    document.addEventListener('DOMContentLoaded', () => renderPage(initialUrl), { once: true });
    window.addEventListener('hashchange', handleRouting);
})();

(() => {
    // Перехватываем и отключаем все события отправки(до следующего спринта)
    // TODO: Реализовать обработку событий отправки форм.
    document.addEventListener('submit', (e) => {
        e.stopPropagation();
        e.preventDefault();
        return false;
    });
})();