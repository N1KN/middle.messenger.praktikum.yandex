import { LinkButton } from 'components/link-button';
import Handlebars from 'handlebars';
import { getUrlByRoute, RouteNames } from 'utils/router';

export const SiteMap = () => {
  const template = `
    <main>
        <nav>
            <ul>
            {{#each pageItems}}
                <li>{{{this}}}</li>
            {{/each}}
            </ul>
        </nav>
    </main>`;

  return Handlebars.compile(template)({
    pageItems: [
      LinkButton({ url: getUrlByRoute(RouteNames.SIGN_IN), text: 'Страница входа' }),
      LinkButton({ url: getUrlByRoute(RouteNames.SIGN_UP), text: 'Страница авторизации' }),
      LinkButton({ url: getUrlByRoute(RouteNames.CHATS), text: 'Чаты' }),
      LinkButton({ url: getUrlByRoute(RouteNames.ACCOUNT), text: 'Информация об аккаунте' }),
      LinkButton({ url: getUrlByRoute(RouteNames.ACCOUNT_EDIT), text: 'Редактирование информации об аккаунте' }),
      LinkButton({ url: getUrlByRoute(RouteNames.CHANGE_PASSWORD), text: 'Изменение пароля' }),
      LinkButton({ url: getUrlByRoute(RouteNames.NOT_FOUND), text: 'Страница 404' }),
      LinkButton({ url: getUrlByRoute(RouteNames.INTERNAL_ERROR), text: 'Страница 500' }),
    ],
  });
};
