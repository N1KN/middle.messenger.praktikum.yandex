import { Button } from 'components/button';
import { Divider } from 'components/divider';
import { LinkButton } from 'components/link-button';
import { PageWrapperWithBackButton } from 'components/page-wrapper-with-back-button';
import { TextField } from 'components/text-field';
import { Block } from 'lib/block';
import { FormHandler } from 'lib/form-validator';
import { cn } from 'utils/bem';
import { getUrlByRoute, RouteNames } from 'utils/router';
import {
  createTextValidator,
  validateLogin,
  validateName,
  validatePhone,
  validateEmail,
  validateMaxLength,
  validateMinLength,
} from 'utils/validators';

import './styles.pcss';

type AccountPageProps = {
  isEditMode?: boolean;
};

const avatarUrl = new URL('/src/static/img/avatar.svg', import.meta.url);

const cnAccountPage = cn('AccountPage');
const accountEditLink = getUrlByRoute(RouteNames.ACCOUNT_EDIT);
const accountChangePasswordLink = getUrlByRoute(RouteNames.CHANGE_PASSWORD);
const accountExitLink = getUrlByRoute(RouteNames.SIGN_IN);
const accountLink = getUrlByRoute(RouteNames.ACCOUNT);
const chatsLink = getUrlByRoute(RouteNames.CHATS);

const loginValidator = createTextValidator(validateLogin, validateMinLength(3), validateMaxLength(20));

export class AccountPage extends Block<AccountPageProps> {
  private _formHandler?: FormHandler;
  constructor(props: AccountPageProps) {
    super(props, 'form');
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
        email: validateEmail,
        phone: validatePhone,
        login: loginValidator,
        display_name: loginValidator,
        first_name: validateName,
        second_name: validateName,
      },
    });
    this.resetFormListeners();
    // TODO: Реализовать работу с сервером
    // eslint-disable-next-line no-console
    this._formHandler.subscribeSubmit((data) => console.log('AccountEdit.onFormSubmit', data));
  }

  render() {
    const { isEditMode = false } = this.props;

    const textFieldCfg = { mode: 'profile', isDisabled: !isEditMode } as const;
    let footerContent;
    let footerButtons: Record<string, Block>;

    if (isEditMode) {
      footerContent = `
            {{{accountSaveButton}}}`;

      footerButtons = {
        accountSaveButton: new Button({
          id: 'saveAccountButton',
          isSubmit: true,
          label: 'Сохранить',
        }),
      };
    } else {
      footerContent = `
            {{{accountEditButton}}}
            {{{divider1}}}
            {{{accountChangePasswordButton}}}
            {{{divider2}}}
            {{{accountExitButton}}}`;
      footerButtons = {
        accountEditButton: new LinkButton({
          className: cnAccountPage('linkButton'),
          text: 'Изменить данные',
          url: accountEditLink,
        }),
        accountChangePasswordButton: new LinkButton({
          className: cnAccountPage('linkButton'),
          text: 'Изменить пароль',
          url: accountChangePasswordLink,
        }),
        accountExitButton: new LinkButton({
          className: cnAccountPage('linkButton', { isExit: true }),
          text: 'Выйти',
          url: accountExitLink,
        }),
        divider1: new Divider({
          className: cnAccountPage('divider'),
        }),
        divider2: new Divider({
          className: cnAccountPage('divider'),
        }),
      };
    }

    const template = `
        <form class="${cnAccountPage()}">
            <div class="${cnAccountPage('headerContent')}">
                <div class="${cnAccountPage('changeAvatar')}">
                    <img src="${avatarUrl}" alt="Аватар по умолчанию" />
                    <div class="${cnAccountPage('changeAvatarText')}">Поменять аватар</div>
                </div>
                <p class="${cnAccountPage('userName', { isEditMode })}">Login</p>
            </div>

            <div class="${cnAccountPage('bodyContent')}">
                {{{mailInput}}}
                {{{loginInput}}}
                {{{firstNameInput}}}
                {{{secondNameInput}}}
                {{{displayNameInput}}}
                {{{phoneInput}}}
            </div>
            <div class="${cnAccountPage('footerContent')}">
                ${footerContent}
            </div>
        </form>`;

    const children = {
      mailInput: new TextField({
        ...textFieldCfg,
        title: 'Почта',
        name: 'email',
        type: 'email',
        value: 'mail@ya.ru',
        errorText: 'Введите корректный адрес почты.',
      }),
      loginInput: new TextField({
        ...textFieldCfg,
        title: 'Логин',
        name: 'login',
        value: 'Login',
        errorText: 'Требование: 3-20 символов, латиница, должен начинаться с буквы, может включать цифры.',
      }),
      firstNameInput: new TextField({
        ...textFieldCfg,
        title: 'Имя',
        name: 'first_name',
        value: 'FirstName',
        errorText: 'Требование: Только латиница или кириллица, первая буква должна быть заглавной, возможен дефис.',
      }),
      secondNameInput: new TextField({
        ...textFieldCfg,
        title: 'Фамилия',
        name: 'second_name',
        value: 'SecondName',
        errorText: 'Требование: Только латиница или кириллица, первая буква должна быть заглавной, возможен дефис.',
      }),
      phoneInput: new TextField({
        ...textFieldCfg,
        title: 'Телефон',
        name: 'phone',
        type: 'tel',
        value: '79876543210',
        errorText: 'Введите корректный номер телефона.',
      }),
      displayNameInput: new TextField({
        ...textFieldCfg,
        title: 'Имя в чате',
        name: 'display_name',
        errorText: 'Требование: 3-20 символов, латиница, должен начинаться с буквы, может включать цифры.',
      }),
      ...footerButtons,
    };

    const fragment = new DocumentFragment();

    fragment.replaceChildren(
      new PageWrapperWithBackButton({
        pageContentTemplate: template,
        children,
        backBtnUrl: isEditMode ? accountLink : chatsLink,
        backBtnLabel: isEditMode ? 'К чатам' : 'К данным об аккаунте',
      }).getContent(),
    );

    return fragment;
  }
}
