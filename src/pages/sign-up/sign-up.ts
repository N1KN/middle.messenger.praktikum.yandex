import Handlebars from 'handlebars';
import { Button } from 'components/button';
import { TextField } from 'components/text-field';
import { LinkButton } from 'components/link-button';
import { getUrlByRoute, RouteNames } from 'utils/router';
import { cn } from 'utils/bem';

import './styles.pcss';


const cnSignUpPage = cn('SignUpPage');

const signInLink = getUrlByRoute(RouteNames.SIGN_IN);

export const SignUpPage = () => {

    const template = `
    <div class="${cnSignUpPage()}">
        <form id="signUpForm" class="${cnSignUpPage('form')}">
            <div class="${cnSignUpPage('title')}">Регистрация</div>
            <div class="${cnSignUpPage('body')}">
                {{{mailInput}}}
                {{{loginInput}}}
                {{{firstnameInput}}}
                {{{surnameInput}}}
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
            name: 'mail',
        }),
        loginInput: TextField({
            title: 'Логин',
            name: 'login',
        }),
        firstnameInput: TextField({
            title: 'Имя',
            name: 'firstname',
        }),
        surnameInput: TextField({
            title: 'Фамилия',
            name: 'surname',
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
            name: 'repeatPassword',
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