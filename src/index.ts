import { AppContainer } from 'containers/app';
import { getHashUrlFromUrl } from 'utils/common';
import { getRouteByUrl, RouteNames } from 'utils/router';
import { NotFoundPage } from 'pages/not-found';
import './styles.css';
type PageFunction = (...props: any[]) => string;

(() => {
    const getPageByUrl = (url: string): PageFunction => {
        const PAGES: Record<RouteNames, PageFunction> = {
            [RouteNames.SIGN_IN]: () => '',
            [RouteNames.REGISTER]: () => '',
            [RouteNames.ACCOUNT]: () => '',
            [RouteNames.ACCOUNT_EDIT]: () => '',
            [RouteNames.CHANGE_PASSWORD]: () => '',
            [RouteNames.CHATS]: () => '',
            [RouteNames.NOT_FOUND]: NotFoundPage,
            [RouteNames.INTERNAL_ERROR]: () => '',
        }

        const ROUTE = getRouteByUrl(url);
        console.log('getPageByUrl', ROUTE)

        return PAGES[getRouteByUrl(url)];
    }

    const rootElement = document.querySelector('#root');
    const initialUrl = getHashUrlFromUrl(document.location.href);

    const renderPage = (url: string) => {
        if (!rootElement) {
            throw new Error(`Root element is not found`);
        }

        rootElement.innerHTML = AppContainer({
            page: getPageByUrl(url)(),
        });
    };

    const handleRouting = (event: HashChangeEvent) => {
        renderPage(event.newURL)
    };

    document.addEventListener('DOMContentLoaded', () => renderPage(initialUrl), { once: true });
    window.addEventListener('hashchange', handleRouting);
})();