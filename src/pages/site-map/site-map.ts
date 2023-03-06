import { LinkButton } from 'components/link-button';
import { Block } from 'lib/block';
import { getUrlByRoute, RouteNames } from 'utils/router';

export class SiteMap extends Block {
  protected init() {
    this.children = {
      ...this.children,
      pageItems: [
        new LinkButton({ url: getUrlByRoute(RouteNames.SIGN_IN), text: 'Страница входа' }),
        new LinkButton({ url: getUrlByRoute(RouteNames.SIGN_UP), text: 'Страница авторизации' }),
        new LinkButton({ url: getUrlByRoute(RouteNames.CHATS), text: 'Чаты' }),
        new LinkButton({ url: getUrlByRoute(RouteNames.ACCOUNT), text: 'Информация об аккаунте' }),
        new LinkButton({
          url: getUrlByRoute(RouteNames.ACCOUNT_EDIT),
          text: 'Редактирование информации об аккаунте',
        }),
        new LinkButton({ url: getUrlByRoute(RouteNames.CHANGE_PASSWORD), text: 'Изменение пароля' }),
        new LinkButton({ url: getUrlByRoute(RouteNames.NOT_FOUND), text: 'Страница 404' }),
        new LinkButton({
          url: getUrlByRoute(RouteNames.INTERNAL_ERROR),
          text: 'Страница 500',
        }),
      ],
    };
  }
  render() {
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

    return this.compile(template, { ...this.props });
  }
}
