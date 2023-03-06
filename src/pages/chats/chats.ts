import { ChatListItem } from 'components/chat-list-item';
import { DialogArea } from 'components/dialog-area';
import { LinkButton } from 'components/link-button';
import { Block } from 'lib/block';
import { cn } from 'utils/bem';
import { getUrlByRoute, RouteNames } from 'utils/router';

import './styles.pcss';

const searchIconUrl = new URL('/src/static/img/search.svg', import.meta.url);

const cnChatsPage = cn('ChatsPage');
const accountLink = getUrlByRoute(RouteNames.ACCOUNT);

export class ChatsPage extends Block {
  protected init() {
    this.children = {
      profileBtn: new LinkButton({
        url: accountLink,
        text: 'Профиль >',
      }),
      chatItem: [
        new ChatListItem({
          className: cnChatsPage('chatItem'),
          chatId: '111',
          title: 'Title',
        }),
        new ChatListItem({
          className: cnChatsPage('chatItem'),
          chatId: '222',
          title: 'Title2',
        }),
        new ChatListItem({
          className: cnChatsPage('chatItem'),
          chatId: '333',
          title: 'Title3',
          lastMessage: 'Ку-ку :)',
          lastMsgTime: '03:40',
          unreadCount: 2,
        }),
        new ChatListItem({
          className: cnChatsPage('chatItem'),
          chatId: '444',
          title: 'Title4',
          lastMessage: 'Моё очень длинное сообщение.',
          youLast: true,
          lastMsgTime: 'Вчера',
        }),
        new ChatListItem({
          className: cnChatsPage('chatItem'),
          chatId: '555',
          title: 'Title5',
        }),
      ],
      dialogArea: new DialogArea({
        chatId: '123',
        title: 'Чат',
        avatar: null,
        messages: [
          {
            id: 1,
            chat_id: 0,
            user_id: 0,
            time: new Date(-10000).toISOString(),
            is_read: true,
            content: 'Привет',
            type: '',
            file: null,
          },
          {
            id: 2,
            chat_id: 0,
            user_id: 2,
            time: new Date(-8000).toISOString(),
            is_read: true,
            content: 'Привет',
            type: '',
            file: null,
          },
          {
            id: 3,
            chat_id: 0,
            user_id: 0,
            time: new Date(-1000).toISOString(),
            is_read: false,
            content: 'Как дела?',
            type: '',
            file: null,
          },
        ],
      }),
    };
  }

  protected render(): DocumentFragment {
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
      {{{dialogArea}}}
      </main>
    </div>`;

    return this.compile(template, {});
  }
}
