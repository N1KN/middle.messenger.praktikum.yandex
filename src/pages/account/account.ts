import Handlebars from 'handlebars';
import { Button } from 'components/button';
import { PageWrapperWithBackButton } from 'components/page-wrapper-with-back-button';
import { Divider } from 'components/divider';
import { TextField } from 'components/text-field';
import { LinkButton } from 'components/link-button';
import { getUrlByRoute, RouteNames } from 'utils/router';
import { cn } from 'utils/bem';

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

export const getAccountPageRender = ({ isEditMode } : AccountPageProps = {}) => () => {
    const textFieldCfg = { mode: 'profile', isDisabled: !isEditMode } as const;
    let footerContent;
    let footerButtons: Record<string, string>;

    if (isEditMode) {
        footerContent = `
            {{{accountSaveButton}}}`;

        footerButtons = {
            accountSaveButton: Button({
                id: 'saveAccount',
                text: 'Сохранить',
            })
        };
    } else {
        footerContent = `
            {{{accountEditButton}}}
            {{{divider}}}
            {{{accountChangePasswordButton}}}
            {{{divider}}}
            {{{accountExitButton}}}`;
        footerButtons = {
            accountEditButton: LinkButton({
                className: cnAccountPage('linkButton'),
                text: 'Изменить данные',
                url: accountEditLink
            }),
            accountChangePasswordButton: LinkButton({
                className: cnAccountPage('linkButton'),
                text: 'Изменить пароль',
                url: accountChangePasswordLink
            }),
            accountExitButton: LinkButton({
                className: cnAccountPage('linkButton', { isExit: true }),
                text: 'Выйти',
                url: accountExitLink
            }),
            divider: Divider({
                className: cnAccountPage('divider')
            })
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

    const pageContent = Handlebars.compile(template)({
        mailInput: TextField({
            ...textFieldCfg,
            title: 'Почта',
            name: 'email',
            type: 'email'
        }),
        loginInput: TextField({
            ...textFieldCfg,
            title: 'Логин',
            name: 'login',
        }),
        firstNameInput: TextField({
            ...textFieldCfg,
            title: 'Имя',
            name: 'first_name',
        }),
        secondNameInput: TextField({
            ...textFieldCfg,
            title: 'Фамилия',
            name: 'second_name',
        }),
        phoneInput: TextField({
            ...textFieldCfg,
            title: 'Телефон',
            name: 'phone',
            type: 'tel',
        }),
        displayNameInput: TextField({
            ...textFieldCfg,
            title: 'Имя в чате',
            name: 'display_name',
            type: 'tel',
        }),

        ...footerButtons,
    });

    return PageWrapperWithBackButton({
        pageContent,
        backBtnUrl: isEditMode ? accountLink : chatsLink,
    });
};

