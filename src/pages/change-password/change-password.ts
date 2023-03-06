import { Button } from 'components/button';
import { PageWrapperWithBackButton } from 'components/page-wrapper-with-back-button';
import { TextField } from 'components/text-field';
import { Block } from 'lib/block';
import { FormHandler } from 'lib/form-validator';
import { cn } from 'utils/bem';
import { getUrlByRoute, RouteNames } from 'utils/router';
import { createTextValidator, validateMaxLength, validateMinLength, validatePassword } from 'utils/validators';

import './styles.pcss';

const avatarUrl = new URL('/src/static/img/avatar.svg', import.meta.url);

const cnChangePassword = cn('ChangePassword');
const accountEditLink = getUrlByRoute(RouteNames.ACCOUNT_EDIT);

const passwordValidator = createTextValidator(validatePassword, validateMinLength(8), validateMaxLength(40));

export class ChangePassword extends Block {
  private _formHandler?: FormHandler;
  constructor() {
    super({}, 'form');
  }

  private resetFormListeners() {
    const form = this.element.querySelector('form');
    if (form instanceof HTMLFormElement) {
      this._formHandler?.removeListeners(form);
      this._formHandler?.setListeners(form);
    }
  }

  componentDidMount() {
    this._formHandler = new FormHandler({
      form: this.element.querySelector('form')!,
      validators: {
        old_password: (text) => text.length > 0,
        new_password: passwordValidator,
      },
      equality: {
        new_password_repeat: 'new_password',
      },
    });
    this.resetFormListeners();
    // TODO: Реализовать работу с сервером
    // eslint-disable-next-line no-console
    this._formHandler.subscribeSubmit((data) => console.log('ChangePassword.onFormSubmit', data));
  }

  render() {
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

    const fragment = new DocumentFragment();

    const children = {
      oldPassword: new TextField({
        mode: 'profile',
        title: 'Старый пароль',
        name: 'old_password',
        type: 'password',
        errorText: 'Введите старый пароль',
      }),
      newPassword: new TextField({
        mode: 'profile',
        title: 'Новый пароль',
        name: 'new_password',
        type: 'password',
        errorText: 'Требование: 8-40 символов, цифры, заглавные и строчные буквы',
      }),
      passwordRepeat: new TextField({
        mode: 'profile',
        title: 'Новый пароль(ещё раз)',
        name: 'new_password_repeat',
        type: 'password',
        errorText: 'Введённый пароли не совпадают',
      }),

      passwordSaveButton: new Button({
        id: 'savePasswordButton',
        isSubmit: true,
        label: 'Сохранить',
      }),
    };

    fragment.replaceChildren(
      new PageWrapperWithBackButton({
        children,
        pageContentTemplate: template,
        backBtnUrl: accountEditLink,
        backBtnLabel: 'К редактированию аккаунта',
      }).getContent(),
    );

    return fragment;
  }
}
