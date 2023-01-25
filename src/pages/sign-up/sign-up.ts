import { Button } from 'components/button';
import { LinkButton } from 'components/link-button';
import { TextField } from 'components/text-field';
import Handlebars from 'handlebars';
import { cn } from 'utils/bem';
import { getUrlByRoute, RouteNames } from 'utils/router';

import './styles.pcss';

const cnSignUpPage = cn('SignUpPage');

const signInLink = getUrlByRoute(RouteNames.SIGN_IN);

export const SignUpPage = () => {
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

  return Handlebars.compile(template)({
    mailInput: TextField({
      title: 'Почта',
      type: 'email',
      name: 'email',
    }),
    loginInput: TextField({
      title: 'Логин',
      name: 'login',
    }),
    firstNameInput: TextField({
      title: 'Имя',
      name: 'first_name',
    }),
    secondNameInput: TextField({
      title: 'Фамилия',
      name: 'second_name',
    }),
    phoneInput: TextField({
      title: 'Телефон',
      name: 'phone',
      type: 'tel',
    }),
    passwordInput: TextField({
      title: 'Пароль',
      name: 'password',
      type: 'password',
    }),
    repeatPasswordInput: TextField({
      title: 'Пароль (ещё раз)',
      name: 'repeat_password',
      type: 'password',
    }),
    regButton: Button({
      id: 'regButton',
      text: 'Зарегистрироваться',
    }),
    signUpLink: LinkButton({
      text: 'Войти',
      url: signInLink,
    }),
  });
};
