import { Block } from 'lib/block';
import { cn } from 'utils/bem';

import './styles.pcss';

type ChatListItemProps = {
  className?: string;
  isActive?: boolean;
  chatId: string;
  title: string;
  lastMessage?: string;
  youLast?: boolean;
  lastMsgTime?: string;
  unreadCount?: number;
};

const cnChatListItem = cn('ChatListItem');

export class ChatListItem extends Block<ChatListItemProps> {
  constructor(props: ChatListItemProps) {
    super(props);
  }

  render() {
    const { className, chatId, title, isActive, youLast, lastMessage, lastMsgTime, unreadCount } = this.props ?? {};

    const lastMessageBlock = `
    <p class="${cnChatListItem('lastMsgText')}">
        ${lastMessage ? `${youLast ? '<span>Вы:</span>' : ''}{{lastMessage}}` : ''}
    </p>`;

    const template = `
    <div class="${cnChatListItem('', { isActive }, [className])}" data-chat-id="{{chatId}}">
            <div class="${cnChatListItem('avatar')}"></div>
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
      lastMessage: lastMessage ?? '',
      lastMsgTime: lastMsgTime ?? '',
      unreadCount: unreadCount ?? '',
    });
  }
}
