import Handlebars from 'handlebars';
import { Button } from 'components/button';
import { TextField } from 'components/text-field';
import { LinkButton } from 'components/link-button';
import { getUrlByRoute, RouteNames } from 'utils/router';
import { cn } from 'utils/bem';

import './styles.pcss';

const cnAccountPage = cn('AccountPage');

const signUpLink = getUrlByRoute(RouteNames.SIGN_UP);

export const AccountPage = () => {

    const template = `
    <div class="${cnAccountPage()}">
        <a class="${cnAccountPage('backButtonWrapper')}">
            <div class="${cnAccountPage('backButton')}"></div>
        </a>
        <div class="${cnAccountPage('formWrapper')}">
            <form class="${cnAccountPage('form')}">
                <div class="edit-avatar">
                <img class="edit-avatar__img" src="/src/static/img/avatar.svg" alt="Аватар по умолчанию">
                <span class="edit-avatar__span">Поменять аватар</span>
                </div>
                <p class="${cnAccountPage('userName')}">Login</p>
                <div class="${cnAccountPage('textFieldsWrapper')}">
                    <div class="${cnAccountPage('inputBlock')}">
                        <input class="input-profile" type="email" value="ma@il.ru" name="email"> <span class="${cnAccountPage('inputBlock')}__span">Почта</span> <span class="${cnAccountPage('inputBlock')}__error"></span> </label>
                    </div>
                    <div class="${cnAccountPage('inputBlock')}">
                        <input class="input-profile" type="text" value="Login" name="login"> <span class="${cnAccountPage('inputBlock')}__span">Логин</span> <span class="${cnAccountPage('inputBlock')}__error"></span> </label>
                    </div>
                    <div class="${cnAccountPage('inputBlock')}">
                        <input class="input-profile" type="text" value="Login" name="name" > <span class="${cnAccountPage('inputBlock')}__span">Имя</span> <span class="${cnAccountPage('inputBlock')}__error"></span> </label>
                    </div>
                    <div class="${cnAccountPage('inputBlock')}">
                        <input class="input-profile" type="text" value="Login" name="surname" > <span class="${cnAccountPage('inputBlock')}__span">Фамилия</span> <span class="${cnAccountPage('inputBlock')}__error"></span> </label>
                    </div>
                    <div class="${cnAccountPage('inputBlock')}">
                        <input class="input-profile" type="text" value="Login" name="nick" > <span class="${cnAccountPage('inputBlock')}__span">Имя в чате</span> <span class="${cnAccountPage('inputBlock')}__error"></span> </label>
                    </div>
                    <div class="${cnAccountPage('inputBlock')}">
                        <input class="input-profile" type="tel" value="+79876543210" name="phone" > <span class="${cnAccountPage('inputBlock')}__span">Телефон</span> <span class="${cnAccountPage('inputBlock')}__error"></span> </label>
                    </div>
                </div>
                <div class="${cnAccountPage('bottom')}">
                    <div class="btn-profile">Изменить данные</div>
                    <div class="btn-profile">Изменить пароль</div>
                    <div class="btn-profile">Выйти</div>
                </div>
            </form>
            <!--<form class="${cnAccountPage('form')}">
                <div class="${cnAccountPage('title')}">Вход</div>
                <div class="${cnAccountPage('body')}">
                    {{{loginInput}}}
                    {{{passwordInput}}}
                    <div class="${cnAccountPage('buttons')}">
                        {{{authButton}}}
                        {{{signUpLink}}}
                    </div>
                </div>
            </form> -->
        </div>
    </div>`;

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

