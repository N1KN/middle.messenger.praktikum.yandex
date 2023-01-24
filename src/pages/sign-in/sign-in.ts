import Handlebars from 'handlebars';
import { Button } from 'components/button';
import { TextField } from 'components/text-field';
import { LinkButton } from 'components/link-button';
import { getUrlByRoute, RouteNames } from 'utils/router';
import { cn } from 'utils/bem';

import './styles.pcss';

const cnSignInPage = cn('SignInPage');

const signUpLink = getUrlByRoute(RouteNames.SIGN_UP);

export const SignInPage = () => {

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

    return Handlebars.compile(template)({
        loginInput: TextField({
            title: 'Логин',
            name: 'login',
        }),
        passwordInput: TextField({
            title: 'Пароль',
            name: 'password',
            type: 'password',
        }),
        authButton: Button({
            id: 'authButton',
            text: 'Авторизация'
        }),
        signUpLink: LinkButton({
            text: 'Нет аккаунта?',
            url: signUpLink
        }),
    });
};
