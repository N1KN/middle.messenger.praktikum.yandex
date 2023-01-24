import { Button } from 'components/button';
import { PageWrapperWithBackButton } from 'components/page-wrapper-with-back-button';
import { TextField } from 'components/text-field';
import Handlebars from 'handlebars';
import { cn } from 'utils/bem';
import { getUrlByRoute, RouteNames } from 'utils/router';

import './styles.pcss';

const avatarUrl = new URL('/src/static/img/avatar.svg', import.meta.url);

const cnChangePassword = cn('ChangePassword');
const accountEditLink = getUrlByRoute(RouteNames.ACCOUNT_EDIT);

export const ChangePassword = () => {
  const template = `
        <form class="${cnChangePassword()}">
            <div class="${cnChangePassword('headerContent')}">
                <div class="${cnChangePassword('changeAvatar')}">
                    <img src="${avatarUrl}" alt="Аватар по умолчанию" />
                    <div class="${cnChangePassword('changeAvatarText')}">Поменять аватар</div>
                </div>
            </div>

            <div class="${cnChangePassword('bodyContent')}">
                {{{oldPassword}}}
                {{{newPassword}}}
                {{{passwordRepeat}}}
            </div>
            <div class="${cnChangePassword('footerContent')}">
                {{{passwordSaveButton}}}
            </div>
        </form>`;

  const pageContent = Handlebars.compile(template)({
    oldPassword: TextField({
      mode: 'profile',
      title: 'Старый пароль',
      name: 'old_password',
      type: 'password',
    }),
    newPassword: TextField({
      mode: 'profile',
      title: 'Новый пароль',
      name: 'new_password',
      type: 'password',
    }),
    passwordRepeat: TextField({
      mode: 'profile',
      title: 'Новый пароль(ещё раз)',
      name: 'new_password_repeat',
      type: 'password',
    }),

    passwordSaveButton: Button({
      id: 'savePasswordButton',
      text: 'Сохранить',
    }),
  });

  return PageWrapperWithBackButton({
    pageContent,
    backBtnUrl: accountEditLink,
    backBtnLabel: 'К редактированию аккаунта',
  });
};
