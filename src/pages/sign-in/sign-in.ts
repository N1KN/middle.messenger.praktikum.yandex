import { RouteNames } from 'app-constants';
import { Button } from 'components/button';
import { LinkButton } from 'components/link-button';
import { TextField } from 'components/text-field';
import { AuthControllerInstance } from 'controllers';
import { Block } from 'lib/block';
import { FormHandler } from 'lib/form-validator';
import { getUrlByRoute, RouterInstance } from 'lib/router';
import { store } from 'store';
import { cn } from 'utils/bem';
import {
  createTextValidator,
  validateLogin,
  validateMaxLength,
  validateMinLength,
  validatePassword,
} from 'utils/validators';

import './styles.pcss';

const cnSignInPage = cn('SignInPage');

const signUpLink = getUrlByRoute(RouteNames.SIGN_UP);

const loginValidator = createTextValidator(validateLogin, validateMinLength(3), validateMaxLength(20));
const passwordValidator = createTextValidator(validatePassword, validateMinLength(8), validateMaxLength(40));

export class SignInPage extends Block {
  private _formHandler!: FormHandler;
  constructor() {
    super({}, 'form');
  }

  private resetFormListeners() {
    const form = this.element.querySelector('form');
    if (form instanceof HTMLFormElement) {
      this._formHandler.removeListeners(form);
      this._formHandler.setListeners(form);
    }
  }

  protected init() {
    const unsubscribe = store.subscribe((state) => {
      if (state.auth.isLoggedIn) {
        RouterInstance.goByRouteName(RouteNames.CHATS);
      }
    });

    this.addToUnmountQueue(unsubscribe);

    this.setChildren({
      loginInput: new TextField({
        title: 'Логин',
        name: 'login',
        errorText: 'Требование: 3-20 символов, латиница, должен начинаться с буквы, может включать цифры',
      }),
      passwordInput: new TextField({
        title: 'Пароль',
        name: 'password',
        type: 'password',
        errorText: 'Требование: 8-40 символов, цифры, заглавные и строчные буквы',
      }),
      authButton: new Button({
        id: 'authButton',
        isSubmit: true,
        label: 'Авторизация',
      }),
      signUpLink: new LinkButton({
        text: 'Нет аккаунта?',
        url: signUpLink,
      }),
    });
  }

  componentDidMount() {
    this._formHandler = new FormHandler({
      form: this.element.querySelector('form')!,
      validators: {
        login: loginValidator,
        password: passwordValidator,
      },
    });
    this.resetFormListeners();
    this._formHandler.subscribeSubmit((data) => {
      AuthControllerInstance.signIn(data);
    });
  }

  render() {
    const template = `
    <main class="${cnSignInPage()}">
        <form class="${cnSignInPage('form')}">
            <div class="${cnSignInPage('title')}">Вход</div>
            <div class="${cnSignInPage('body')}">
                {{{loginInput}}}
                {{{passwordInput}}}
                <div class="${cnSignInPage('buttons')}">
                    {{{authButton}}}
                    {{{signUpLink}}}
                </div>
            </div>
        </form>
    </main>`;

    return this.compile(template);
  }
}
