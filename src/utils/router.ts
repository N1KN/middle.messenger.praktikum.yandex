import { RouteNames, SITE_PATHS } from 'constants';
import { Block } from 'lib/block';
import { setElementByIndex } from './common';
import { Route } from './route';

type AnyBlockComponents = typeof Block<any>;

export const getUrlByRoute = (route: RouteNames, withFirstSlash?: boolean): string => {
  return `${withFirstSlash ? '/' : ''}${SITE_PATHS[route]}`;
};

export function getRouteByUrlOrNotFoundRoute(url: string, notFoundRoteByDefault: true): RouteNames;
export function getRouteByUrlOrNotFoundRoute(url: string, notFoundRoteByDefault?: false): RouteNames | undefined;
export function getRouteByUrlOrNotFoundRoute(url: string, notFoundRoteByDefault = false): RouteNames | undefined {
  // Очищаем url от части "/"
  const clearUrl = url.slice(1);

  // Переменная _ действительно не используется, мы её пропускаем осознанно
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const routeName = (Object.entries(SITE_PATHS) as [RouteNames, string][]).find(([_, path]) => path === clearUrl);

  if (notFoundRoteByDefault) {
    return routeName?.[0] ?? RouteNames.NOT_FOUND;
  }

  return routeName?.[0];
}

export class Router {
  static __instance: Router;
  private _routes: Route[] = [];
  private history: History = window.history;
  private _currentRoute: Route | null = null;
  private _notFoundRoute: Route | null = null;

  constructor() {
    if (Router.__instance) {
      return Router.__instance;
    }

    Router.__instance = this;
  }

  private _useRoute(pathname: string, route: Route) {
    if (this.getRoute(pathname)) {
      const replaceIndex = this._routes.findIndex((route) => route.match(pathname));

      // TODO: Возможно, стоит как-то регулировать ситуацию замены роута, но я пока решил оставить только уведомление
      // eslint-disable-next-line no-console
      console.log(`Router: Element with path[${pathname}] replaced`);

      this._routes = setElementByIndex(this._routes, route, replaceIndex);
    } else {
      this._routes.push(route);
    }

    return this;
  }

  useAsNotFoundRoute(pathname: string, block: AnyBlockComponents, props: Record<string, any> = {}) {
    const route = new Route(pathname, block, props);

    if (this._notFoundRoute !== null) {
      throw new Error('NotFound route has already been configured!');
    }

    this._notFoundRoute = route;

    return this._useRoute(pathname, route);
  }

  clearNotFoundRoute() {
    this._notFoundRoute = null;
    return this;
  }

  use(pathname: string, block: AnyBlockComponents, props: Record<string, any> = {}) {
    const route = new Route(pathname, block, props);

    return this._useRoute(pathname, route);
  }

  start() {
    window.onpopstate = (event) => {
      const target = event.currentTarget as Window;
      this._onRoute(target.location.pathname.slice(1));
    };

    this._onRoute(window.location.pathname.slice(1));
  }

  getRoute(pathname: string): Route | undefined {
    return this._routes.find((route) => route.match(pathname));
  }

  getRoutes() {
    return this._routes;
  }

  private _onRoute(pathname: string) {
    let route = this.getRoute(pathname);

    if (!route) {
      if (!this._notFoundRoute) {
        throw new Error(`Route ${pathname} not found and defaultRoute not configured`);
      }
      route = this._notFoundRoute;
    }

    if (this._currentRoute && this._currentRoute !== route) {
      this._currentRoute.leave();
    }

    this._currentRoute = route;
    route.render();
  }

  go(pathname: string) {
    this.history.pushState({}, '', `/${pathname}`);
    this._onRoute(pathname);
  }

  goByRouteName(route: RouteNames) {
    this.go(getUrlByRoute(route, false));
  }

  back() {
    this.history.back();
  }

  forward() {
    this.history.forward();
  }
}

export const RouterInstance = new Router();
