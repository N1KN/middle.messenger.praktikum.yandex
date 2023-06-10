import { RouteNames } from 'app-constants/router';
import { Button } from 'components/button';
import { ChatListItem } from 'components/chat-list-item';
import { DialogArea } from 'components/dialog-area';
import { LinkButton } from 'components/link-button';
import Popup from 'components/popup';
import { TextField } from 'components/text-field';
import { ChatsControllerInstance } from 'controllers/chat-controller';
import { Block, IBlockProps, OnUpdateProps } from 'lib/block';
import { getUrlByRoute } from 'lib/router';
import { RootDucks, RootState, store } from 'store';
import { cn } from 'utils/bem';
import { isNotNil } from 'utils/common';
import { showTooltip } from 'utils/tooltip';

import './styles.pcss';

type ChatsPageState = {
  selectedChat: RootState[RootDucks.CHATS]['chats'][number] | null;
  chats: RootState[RootDucks.CHATS]['chats'];
  user: RootState[RootDucks.USER]['userInfo'];
};

const searchIconUrl = new URL('/src/static/img/search.svg', import.meta.url);

const cnChatsPage = cn('ChatsPage');
const accountLink = getUrlByRoute(RouteNames.ACCOUNT);

export class ChatsPage extends Block<IBlockProps, ChatsPageState> {
  constructor() {
    super();
    this.state.chats = [];
    this.state.selectedChat = null;
    this.state.user = null;
  }
  protected init() {
    ChatsControllerInstance.fetchChats();

    const unsubscribe = store.subscribe((state) => {
      this.state.chats = state.chats.chats;
      const selectedChat = state.chats.chats.find((chat) => chat.id === state.chats.selectedChatId);

      this.state.selectedChat = selectedChat ?? null;
      this.state.user = state.user.userInfo;
    });

    this.addToUnmountQueue(unsubscribe);

    this.setChildren({
      profileBtn: new LinkButton({
        url: accountLink,
        text: 'Профиль >',
      }),
      addChatButton: new Button({
        label: '+ Чат',
        onClick: () => {
          (this.children.newChatPopup as Block).show();
        },
        isSubmit: false,
      }),
      chatItems: [],
      dialogArea: new DialogArea({
        userId: null,
        chatId: null,
        title: null,
        avatar: null,
        // messages: [],
      }),
    });

    this.children.newChatPopup = new Popup({
      title: 'Создать новый чат?',
      button: new Button({
        label: 'Создать',
        isSubmit: true,
      }),
      content: [
        new TextField({
          title: 'Имя нового чата',
          type: 'text',
          name: 'chatName',
        }),
      ],
      onClose: () => {
        (this.children.newChatPopup as Block).hide();
      },
      onSubmit: (data) => {
        ChatsControllerInstance.create(data.chatName).then(() => {
          (this.children.newChatPopup as Block).hide();
          showTooltip({
            message: 'Чат создан',
            type: 'success',
          });
        });
      },
    });
  }

  componentDidUpdate({ oldTarget, target, type }: OnUpdateProps): boolean {
    if (type === Block.UPDATE_EVENTS.STATE) {
      const onItemClick = (chatId: number) => ChatsControllerInstance.selectChat(chatId);

      this.children.chatItems = this.state.chats.map(
        (chatItem) =>
          new ChatListItem({
            className: cnChatsPage('chatItem'),
            avatar: chatItem.avatar,
            onClick: onItemClick,
            isActive: isNotNil(this.state.selectedChat?.id) && this.state.selectedChat?.id === chatItem.id,
            chatId: chatItem.id,
            userLogin: this.state.user?.login ?? '',
            title: chatItem.title,
            lastMessage: chatItem.last_message,
          }),
      );

      (this.children.dialogArea as DialogArea | undefined)?.setProps({
        userId: this.state.user?.id,
        chatId: this.state.selectedChat?.id,
        avatar: this.state.selectedChat?.avatar,
        title: this.state.selectedChat?.title,
      });
    }

    return super.componentDidUpdate({ oldTarget, target, type });
  }

  protected render(): DocumentFragment {
    const template = `
    <div class="${cnChatsPage()}">
      <aside class="${cnChatsPage('leftBlock')}">
        <header class="${cnChatsPage('chatListHeader')}">
            <div class="${cnChatsPage('profileBtnWrapper')}">
            {{{addChatButton}}}
            {{{profileBtn}}}
            </div>
            <div class="${cnChatsPage('chatSearchWrapper')}">
              <div class="${cnChatsPage('chatSearch')}">
                <input name="search_chat" type="text" placeholder="Поиск">
                <img src="${searchIconUrl}" alt="Поиск по чату">
              </div>
            </div>
        </header>
        <div class="${cnChatsPage('chatList')}">
            {{#each chatItems}}
                {{{this}}}
            {{/each}}
        </div>
      </aside>
      <main class="${cnChatsPage('rightBlock')}">
      {{{dialogArea}}}
      </main>
      {{{newChatPopup}}}
    </div>`;

    return this.compile(template, {});
  }
}
