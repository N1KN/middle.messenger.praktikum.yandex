import { RouteNames } from 'app-constants/router';
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
  validateName,
  validatePhone,
  validateEmail,
  validateMaxLength,
  validateMinLength,
  validatePassword,
} from 'utils/validators';

import './styles.pcss';

const cnSignUpPage = cn('SignUpPage');

const signInLink = getUrlByRoute(RouteNames.SIGN_IN);
const loginValidator = createTextValidator(validateLogin, validateMinLength(3), validateMaxLength(20));
const passwordValidator = createTextValidator(validatePassword, validateMinLength(8), validateMaxLength(40));
export class SignUpPage extends Block {
  private _formHandler!: FormHandler;

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
      mailInput: new TextField({
        title: 'Почта',
        type: 'email',
        name: 'email',
        errorText: 'Введите корректный адрес почты.',
      }),
      loginInput: new TextField({
        title: 'Логин',
        name: 'login',
        errorText: 'Требование: 3-20 символов, латиница, должен начинаться с буквы, может включать цифры.',
      }),
      firstNameInput: new TextField({
        title: 'Имя',
        name: 'first_name',
        errorText: 'Требование: Только латиница или кириллица, первая буква должна быть заглавной, возможен дефис.',
      }),
      secondNameInput: new TextField({
        title: 'Фамилия',
        name: 'second_name',
        errorText: 'Требование: Только латиница или кириллица, первая буква должна быть заглавной, возможен дефис.',
      }),
      phoneInput: new TextField({
        title: 'Телефон',
        name: 'phone',
        type: 'tel',
        errorText: 'Введите корректный номер телефона.',
      }),
      passwordInput: new TextField({
        title: 'Пароль',
        name: 'password',
        type: 'password',
        errorText: 'Требование: 8-40 символов, цифры, заглавные и строчные буквы',
      }),
      repeatPasswordInput: new TextField({
        title: 'Пароль (ещё раз)',
        name: 'repeat_password',
        type: 'password',
        errorText: 'Введённый пароли не совпадают',
      }),
      regButton: new Button({
        id: 'regButton',
        isSubmit: true,
        label: 'Зарегистрироваться',
      }),
      signUpLink: new LinkButton({
        text: 'Войти',
        url: signInLink,
      }),
    });
  }

  componentDidMount() {
    this._formHandler = new FormHandler({
      form: this.element.querySelector('form')!,
      validators: {
        email: validateEmail,
        phone: validatePhone,
        login: loginValidator,
        password: passwordValidator,
        first_name: validateName,
        second_name: validateName,
      },
      equality: {
        repeat_password: 'password',
      },
    });
    this.resetFormListeners();
    this._formHandler.subscribeSubmit((data) => {
      AuthControllerInstance.signUp(data);
    });
  }

  render() {
    const template = `
    <main class="${cnSignUpPage()}">
        <form id="signUpForm" class="${cnSignUpPage('form')}">
            <div class="${cnSignUpPage('title')}">Регистрация</div>
            <div class="${cnSignUpPage('body')}">
                {{{mailInput}}}
                {{{loginInput}}}
                {{{firstNameInput}}}
                {{{secondNameInput}}}
                {{{phoneInput}}}
                {{{passwordInput}}}
                {{{repeatPasswordInput}}}
                <div class="${cnSignUpPage('buttons')}">
                    {{{regButton}}}
                    {{{signUpLink}}}
                </div>
            </div>
        </form>
    </div>`;

    return this.compile(template);
  }
}
