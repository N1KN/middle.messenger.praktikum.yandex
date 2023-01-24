import Handlebars from 'handlebars';
import { LinkButton } from 'components/link-button';
import { cn } from 'utils/bem';
import { getUrlByRoute, RouteNames } from 'utils/router';

import './styles.pcss';
import { ChatListItem } from 'components/chat-list-item';

const searchIconUrl = new URL('/src/static/img/search.svg', import.meta.url);

const cnChatsPage = cn('ChatsPage');
const accountLink = getUrlByRoute(RouteNames.ACCOUNT);

export const ChatsPage = () => {
    const template = `
    <div class="${cnChatsPage()}">
      <aside class="${cnChatsPage('leftBlock')}">
        <header class="${cnChatsPage('chatListHeader')}">
            <div class="${cnChatsPage('profileBtnWrapper')}">
            {{{profileBtn}}}
            </div>
            <form class="${cnChatsPage('chatSearchWrapper')}">
              <div class="${cnChatsPage('chatSearch')}">
                <input name="search_chat" type="text" placeholder="Поиск">
                <img src="${searchIconUrl}" alt="Поиск по чату">
              </div>
            </form>
        </header>
        <div class="${cnChatsPage('chatList')}">
            {{#each chatItem}}
                {{{this}}}
            {{/each}}
        </div>
      </aside>
      <main class="${cnChatsPage('rightBlock')}">
        <div class="${cnChatsPage('emptyContent')}">
            <div>Выберите чат, чтобы отправить сообщение</div>
        </div>
      </main>
    </div>`;

    return Handlebars.compile(template)({
        profileBtn: LinkButton({
            url: accountLink,
            text: 'Профиль >'
        }),
        chatItem: [
            ChatListItem({
                className: cnChatsPage('chatItem'),
                chatId: '111',
                title: 'Title',
            }),
            ChatListItem({
                className: cnChatsPage('chatItem'),
                chatId: '222',
                title: 'Title2',
            }),
            ChatListItem({
                className: cnChatsPage('chatItem'),
                chatId: '333',
                title: 'Title3',
                lastMessage: 'Ку-ку :)',
                lastMsgTime: '03:40',
                unreadCount: 2
            }),
            ChatListItem({
                className: cnChatsPage('chatItem'),
                chatId: '444',
                title: 'Title4',
                lastMessage: 'Моё очень длинное сообщение.',
                youLast: true,
                lastMsgTime: 'Вчера'
            }),
            ChatListItem({
                className: cnChatsPage('chatItem'),
                chatId: '555',
                title: 'Title5',
            }),
        ],
    });
};
