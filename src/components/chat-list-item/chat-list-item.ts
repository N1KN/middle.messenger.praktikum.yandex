import { ChatResponseDTO } from 'api/chats/types';
import { Avatar } from 'components/avatar';
import { Block, IBlockProps } from 'lib/block';
import { cn } from 'utils/bem';
import { createFormattedDateString, createUrlToResource, getDate, getType } from 'utils/common';

import './styles.pcss';

type ChatListItemProps = {
  className?: string;
  avatar?: string | null;
  isActive?: boolean;
  chatId: number;
  userLogin: string;
  title: string;
  lastMessage: ChatResponseDTO['last_message'];
  unreadCount?: number;
  onClick: (chatId: number) => void;
};

const cnChatListItem = cn('ChatListItem');

const defaultAvatarUrl = new URL('/src/static/img/avatar.svg', import.meta.url).toString();

export class ChatListItem extends Block<ChatListItemProps> {
  constructor(props: ChatListItemProps) {
    const events: IBlockProps['events'] = {
      click: () => {
        props.onClick(props.chatId);
      },
    };
    super({ ...props, events });
  }

  protected init() {
    this.children.chatAvatar = new Avatar({
      className: cnChatListItem('avatar'),
      src: createUrlToResource(defaultAvatarUrl, this.props.avatar),
      label: 'Аватар чата',
    });
  }

  render() {
    const { className, userLogin, chatId, title, isActive, lastMessage, unreadCount } = this.props ?? {};
    const msgDate = lastMessage ? getDate(lastMessage.time) : null;
    const youLast = lastMessage?.user.login === userLogin;
    const lastMessageText = getType(lastMessage?.content) === 'string' ? lastMessage?.content : '';

    const lastMessageBlock = `
    <p class="${cnChatListItem('lastMsgText')}">
        ${lastMessage ? `${youLast ? '<span>Вы:</span>' : ''}{{lastMessageText}}` : ''}
    </p>`;

    const template = `
    <div class="${cnChatListItem('', { isActive }, [className])}" data-chat-id="{{chatId}}">
            {{{chatAvatar}}}
            <!--div class="${cnChatListItem('avatar')}"></div-->
            <div class="${cnChatListItem('body')}">
                <p class="${cnChatListItem('title')}">{{title}}</p>
                ${lastMessageBlock}
            </div>
            <div class="${cnChatListItem('lastActivityWrapper')}">
                <time class="${cnChatListItem('lastMsgTime')}">{{lastMsgTime}}</time>
                <p class="${cnChatListItem('unreadMsgCount', { isShow: unreadCount !== undefined })}">
                    {{unreadCount}}
                </p>
            </div>
    </div>`;

    return this.compile(template, {
      chatId,
      title,
      lastMessageText,
      lastMsgTime: msgDate ? createFormattedDateString(msgDate) : '',
      unreadCount: unreadCount ?? '',
    });
  }
}
