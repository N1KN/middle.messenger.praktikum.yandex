import { RouteNames } from 'constants/router';
import { UserResponseDTO } from 'api/user/types';
import { Button } from 'components/button';
import { Divider } from 'components/divider';
import { EditAvatar } from 'components/edit-avatar';
import { LinkButton } from 'components/link-button';
import { PageWrapperWithBackButton } from 'components/page-wrapper-with-back-button';
import Popup from 'components/popup';
import { TextField } from 'components/text-field';
import { AuthControllerInstance } from 'controllers';
import { UserControllerInstance } from 'controllers/user-controller';
import { Block } from 'lib/block';
import { FormHandler } from 'lib/form-validator';
import { store } from 'store';
import { cn } from 'utils/bem';
import { createUrlToResource } from 'utils/common';
import { getUrlByRoute } from 'utils/router';
import { showTooltip } from 'utils/tooltip';
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

type AccountPageState = {
  user?: UserResponseDTO | null;
  changeAvatarPopup: Popup;
};

const avatarUrl = new URL('/src/static/img/avatar.svg', import.meta.url).toString();

const cnAccountPage = cn('AccountPage');
const accountEditLink = getUrlByRoute(RouteNames.ACCOUNT_EDIT);
const accountChangePasswordLink = getUrlByRoute(RouteNames.CHANGE_PASSWORD);
const accountExitLink = getUrlByRoute(RouteNames.SIGN_IN);
const accountLink = getUrlByRoute(RouteNames.ACCOUNT);
const chatsLink = getUrlByRoute(RouteNames.CHATS);

const loginValidator = createTextValidator(validateLogin, validateMinLength(3), validateMaxLength(20));

export class AccountPage extends Block<AccountPageProps, AccountPageState> {
  private _formHandler?: FormHandler;
  constructor(props: AccountPageProps) {
    super(props, 'form');
  }

  protected init() {
    this.state.user = store.getState().user.userInfo!;
    const unsubscribe = store.subscribe((state) => {
      this.state.user = state.user.userInfo!;
    });

    this.addToUnmountQueue(unsubscribe);

    this.state.changeAvatarPopup = new Popup({
      title: 'Загрузить новый аватар?',
      button: new Button({
        label: 'Загрузить',
        isSubmit: true,
      }),
      content: [
        new TextField({
          title: 'Выберите картинку',
          type: 'file',
          name: 'avatarFile',
        }),
      ],
      onClose: () => {
        (this.state.changeAvatarPopup as Block).hide();
      },
      onSubmit: (data) => {
        const formData = new FormData();
        formData.append('avatar', data.avatarFile);

        UserControllerInstance.updateAvatar(formData).then(() => {
          (this.state.changeAvatarPopup as Block).hide();
          showTooltip({
            message: 'Аватар загружен',
            type: 'success',
          });
        });
      },
    });
  }

  private resetFormListeners() {
    const form = this.element.querySelector('form#account');
    if (form instanceof HTMLFormElement) {
      this._formHandler?.removeListeners(form);
      this._formHandler?.setListeners(form);
    }
  }

  componentDidMount() {
    this._formHandler = new FormHandler({
      form: this.element.querySelector('form#account')!,
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

    this._formHandler.subscribeSubmit((data) => {
      UserControllerInstance.updateUser(data);
    });
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
          events: {
            click: (e: MouseEvent) => {
              e.stopPropagation();
              AuthControllerInstance.logout();

              return;
            },
          },
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
        <div>
           <form id="account" class="${cnAccountPage()}">
              <div class="${cnAccountPage('headerContent')}">
                  {{{changeAvatar}}}
                  <!--div class="${cnAccountPage('changeAvatar')}">
                      <img src="${avatarUrl}" alt="Аватар по умолчанию" />
                      <div class="${cnAccountPage('changeAvatarText')}">Поменять аватар</div>
                  </div-->
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
           </form>
           {{{changeAvatarPopup}}}
        </div>`;

    const userState = this.state.user;

    const children = {
      changeAvatar: new EditAvatar({
        className: cnAccountPage('changeAvatar'),
        avatarUrl: createUrlToResource(avatarUrl, userState?.avatar),
        onClick: () => {
          this.state.changeAvatarPopup.show();
        },
      }),
      changeAvatarPopup: this.state.changeAvatarPopup,
      mailInput: new TextField({
        ...textFieldCfg,
        title: 'Почта',
        name: 'email',
        type: 'email',
        value: userState?.email,
        errorText: 'Введите корректный адрес почты.',
      }),
      loginInput: new TextField({
        ...textFieldCfg,
        title: 'Логин',
        name: 'login',
        value: userState?.login,
        errorText: 'Требование: 3-20 символов, латиница, должен начинаться с буквы, может включать цифры.',
      }),
      firstNameInput: new TextField({
        ...textFieldCfg,
        title: 'Имя',
        name: 'first_name',
        value: userState?.first_name,
        errorText: 'Требование: Только латиница или кириллица, первая буква должна быть заглавной, возможен дефис.',
      }),
      secondNameInput: new TextField({
        ...textFieldCfg,
        title: 'Фамилия',
        name: 'second_name',
        value: userState?.second_name,
        errorText: 'Требование: Только латиница или кириллица, первая буква должна быть заглавной, возможен дефис.',
      }),
      phoneInput: new TextField({
        ...textFieldCfg,
        title: 'Телефон',
        name: 'phone',
        type: 'tel',
        value: userState?.phone,
        errorText: 'Введите корректный номер телефона.',
      }),
      displayNameInput: new TextField({
        ...textFieldCfg,
        title: 'Имя в чате',
        name: 'display_name',
        value: userState?.display_name ?? '',
        errorText: 'Требование: 3-20 символов, латиница, должен начинаться с буквы, может включать цифры.',
      }),
      ...footerButtons,
    };

    const fragment = new DocumentFragment();

    const blockInstance = new PageWrapperWithBackButton({
      pageContentTemplate: template,
      children,
      backBtnUrl: isEditMode ? accountLink : chatsLink,
      backBtnLabel: isEditMode ? 'К чатам' : 'К данным об аккаунте',
    });

    fragment.replaceChildren(blockInstance.getContent());

    blockInstance.emitComponentDidMount();

    return fragment;
  }
}
