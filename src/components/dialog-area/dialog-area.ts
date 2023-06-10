import { APP_URLS } from 'constants';
import { ChatResponseDTO } from 'api/chats/types';
import { Avatar } from 'components/avatar';
import { Button } from 'components/button';
import { DialogForm } from 'components/dialog-form';
import { MessageBlock } from 'components/message-block';
import Popup from 'components/popup';
import { TextField } from 'components/text-field';
import { ChatsControllerInstance } from 'controllers/chat-controller';
import { MessagesControllerInstance } from 'controllers/message-controller';
import { Block, IBlockProps, OnUpdateProps } from 'lib/block';
import { RootDucks, RootState, store } from 'store';
import { cn } from 'utils/bem';
import { createUrlToResource, isNotNil } from 'utils/common';
import { getIdUniqDays } from 'utils/messages';
import { showTooltip } from 'utils/tooltip';

import './styles.pcss';

type DialogAreaProps = {
  className?: string;
  chatId?: number | null;
  userId?: number | null;
  title?: ChatResponseDTO['title'] | null;
  avatar?: ChatResponseDTO['avatar'] | null;
  // messages: MessageDTO[];
};

type DialogAreaState = {
  userId?: number | null;
  chatMenuIsShown: boolean;
  messages: RootState[RootDucks.CHATS]['messages'][number];
  usersInChat: RootState[RootDucks.CHATS]['usersInSelectedChat'];
};

const cnDialogArea = cn('DialogArea');

const defaultAvatarUrl = new URL('/src/static/img/avatar.svg', import.meta.url).toString();
export class DialogArea extends Block<DialogAreaProps, DialogAreaState> {
  constructor(props: DialogAreaProps) {
    const events: IBlockProps['events'] = {
      click: (e: MouseEvent) => {
        if ((e.target as HTMLElement).classList.contains(cnDialogArea('chatMenu-hiddenOverlay'))) {
          this.hideChatMenu();
        }
      },
    };

    super({ ...props, events });
    this.setState({
      userId: props.userId,
      messages: [],
      usersInChat: [],
      chatMenuIsShown: false,
    });
  }

  private toggleChatMenu() {
    this.state.chatMenuIsShown = !this.state.chatMenuIsShown;
  }

  private hideChatMenu() {
    this.state.chatMenuIsShown = false;
  }

  private showErrorOnDeleteUser(isNotFound?: boolean) {
    showTooltip({
      message: `Произошла ошибка при удалении пользователя${isNotFound ? '. Логин не найден.' : ''}`,
      type: 'error',
    });
  }
  protected init() {
    const { avatar } = this.props;
    let { chatId } = this.props;

    if (chatId) {
      this.state.messages = store.getState().chats.messages[chatId] ?? [];
      this.state.usersInChat = store.getState().chats.usersInSelectedChat;
    }

    const unsubscribe = store.subscribe((state) => {
      chatId = this.props.chatId;
      if (chatId) {
        this.state.messages = state.chats.messages[chatId] ?? [];
        this.state.usersInChat = state.chats.usersInSelectedChat;
      }
    });

    this.addToUnmountQueue(unsubscribe);

    this.setChildren({
      chatAvatar: new Avatar({
        src: (avatar ? `${APP_URLS.RESOURCES}${avatar}` : defaultAvatarUrl).toString(),
        label: 'Аватар пользователя',
      }),
      menuBtn: new Button({
        className: cnDialogArea('menuButton'),
        label: 'Меню',
        onClick: this.toggleChatMenu.bind(this),
      }),
      dialogForm: new DialogForm({
        onSubmit: (msg: string) => {
          MessagesControllerInstance.sendMessage(chatId!, msg);
        },
      }),
      messageBlocks: [],

      addUserButton: new Button({
        label: 'Добавить пользователя',
        onClick: () => {
          (this.children.addUserPopup as Popup).show();
          this.hideChatMenu();
        },
      }),
      deleteUserButton: new Button({
        label: 'Удалить пользователя',
        onClick: () => {
          (this.children.deleteUserPopup as Popup).show();
          this.hideChatMenu();
        },
      }),
      deleteChatButton: new Button({
        label: 'Удалить чат',
        onClick: () => {
          (this.children.deleteChatPopup as Popup).show();
          this.hideChatMenu();
        },
      }),

      addUserPopup: new Popup({
        title: 'Добавить пользователя в чат?',
        button: new Button({
          label: 'Добавить',
          isSubmit: true,
        }),
        content: [
          new TextField({
            title: 'Логин пользователя',
            type: 'text',
            name: 'userLoginToAdd',
          }),
        ],
        onClose: () => {
          (this.children.addUserPopup as Block).hide();
        },
        onSubmit: ({ userLoginToAdd }) => {
          ChatsControllerInstance.addUserToChatByLogin({ chatId: chatId!, login: userLoginToAdd }).then(() => {
            (this.children.addUserPopup as Block).hide();
            showTooltip({
              message: 'Пользователь добавлен',
              type: 'success',
            });
          });
        },
      }),
      deleteUserPopup: new Popup({
        title: 'Выгнать пользователя из чата?',
        button: new Button({
          label: 'Выгнать',
          isSubmit: true,
        }),
        content: [
          new TextField({
            title: 'Логин пользователя',
            type: 'text',
            name: 'userLoginToDelete',
          }),
        ],
        onClose: () => {
          (this.children.deleteUserPopup as Block).hide();
        },
        onSubmit: ({ userLoginToDelete }) => {
          const user = this.state.usersInChat.find((user) => user.login === userLoginToDelete);

          if (user) {
            ChatsControllerInstance.deleteUserFromChat({ users: [user.id], chatId: chatId! })
              .then(() => {
                showTooltip({
                  message: 'Пользователь удалён',
                  type: 'success',
                });
              })
              .catch(() => {
                this.showErrorOnDeleteUser();
              });
          } else {
            this.showErrorOnDeleteUser(true);
          }

          (this.children.deleteUserPopup as Block).hide();
        },
      }),
      deleteChatPopup: new Popup({
        title: 'Удалить этот чат?',
        button: new Button({
          label: 'Удалить',
          onClick: () => {
            ChatsControllerInstance.removeChatById(chatId!).then(() => {
              (this.children.deleteChatPopup as Block).hide();
              showTooltip({
                message: 'Чат удалён',
                type: 'success',
              });
            });
          },
        }),
        content: [],
        onClose: () => {
          (this.children.deleteChatPopup as Block).hide();
        },
      }),
    });
  }

  protected componentDidUpdate({ oldTarget, target, type }: OnUpdateProps) {
    if (type === Block.UPDATE_EVENTS.STATE) {
      const { userId, messages = [] } = target as Partial<DialogAreaState>;

      const firstMessagesOnDate = getIdUniqDays(messages);

      this.children.messageBlocks = messages
        // TODO: Добавить отображение файлов
        .filter((message) => !isNotNil(message.file))
        .map(
          ({ content, is_read, time, user_id, id }) =>
            new MessageBlock({
              content,
              time,
              isFirstMessageAtTime: firstMessagesOnDate.some((firstMessage) => firstMessage?.id === id),
              isRead: is_read,
              isMine: user_id === userId,
            }),
        );
    }

    if (type === Block.UPDATE_EVENTS.PROPS) {
      this.state.userId = target.userId;

      (this.children.chatAvatar as Avatar).setProps((prevProps) => ({
        ...prevProps,
        src: createUrlToResource(defaultAvatarUrl, this.props.avatar),
      }));
    }

    return super.componentDidUpdate({ oldTarget, target, type });
  }

  protected render() {
    const { className, chatId, title } = this.props;
    const isShown = this.state.chatMenuIsShown;

    if (!chatId) {
      const template = `
      <div class="${cnDialogArea('', { isEmpty: true }, [className])}">
        <div>Выберите чат, чтобы отправить сообщение</div>
      </div>`;

      return this.compile(template);
    }

    const template = `
    <div class="${cnDialogArea('', [className])}">
      <div class="${cnDialogArea('header')}">
        <div class="${cnDialogArea('title')}">
          {{{chatAvatar}}}
          <p class="chat__user-name">${title}</p>
        </div>
        {{{menuBtn}}}
      </div>
      <div class="${cnDialogArea('chatMenu', { isShown })}">
        <ul class="${cnDialogArea('chatMenu-list')}">
          <li class="${cnDialogArea('chatMenu-item')}">
            {{{ addUserButton }}}
          </li>
          <li class="${cnDialogArea('chatMenu-item')}">
            {{{ deleteUserButton }}}
          </li>
          <li class="${cnDialogArea('chatMenu-item')}">
            {{{ deleteChatButton }}}
          </li>
        </ul>
      </div>
      <div class="${cnDialogArea('chatMenuWrapper')}">
        <div class="${cnDialogArea('chatMenu-hiddenOverlay')}"></div>
      </div>

      <div class="${cnDialogArea('messagesWrapper')}">
        <div class="${cnDialogArea('messages')}">
          {{#each messageBlocks}}
            {{{this}}}
          {{/each}}
        </div>
      </div>
      <div class="${cnDialogArea('footer')}">
        {{{dialogForm}}}
      </div>
      {{{ addUserPopup }}}
      {{{ deleteUserPopup }}}
      {{{ deleteChatPopup }}}
    </div>
    `;

    return this.compile(template);
  }
}
