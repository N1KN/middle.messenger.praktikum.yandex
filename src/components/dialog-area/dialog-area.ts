import { ChatResponseDTO, MessageDTO } from 'api/chats/types';
import { Avatar } from 'components/avatar';
import { Button } from 'components/button';
import { DialogForm } from 'components/dialog-form';
import { MessageBlock } from 'components/message-block';
import { Block } from 'lib/block';
import { cn } from 'utils/bem';

import './styles.pcss';

type DialogAreaProps = {
  className?: string;
  chatId?: string;
  title: ChatResponseDTO['title'];
  avatar: ChatResponseDTO['avatar'];
  messages: MessageDTO[];
};

const cnDialogArea = cn('DialogArea');

const defaultAvatarUrl = new URL('/src/static/img/avatar.svg', import.meta.url);
const MINE_USER_ID = 0;
export class DialogArea extends Block<DialogAreaProps> {
  protected init() {
    const { avatar, messages = [] } = this.props;

    this.children = {
      chatAvatar: new Avatar({
        src: (avatar ?? defaultAvatarUrl).toString(),
        label: 'Аватар пользователя',
      }),
      menuBtn: new Button({
        className: cnDialogArea('menuButton'),
        label: 'Меню',
      }),
      dialogForm: new DialogForm({}),
      messages: messages.map(
        ({ content, is_read, time, user_id }) =>
          new MessageBlock({
            content,
            time,
            isFirstMessageAtTime: false,
            isRead: is_read,
            isMine: user_id === MINE_USER_ID,
          }),
      ),
    };
  }

  render() {
    const { className, chatId, title } = this.props;

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
      <div class="${cnDialogArea('messages')}">
        {{#each messages}}
          {{{this}}}
        {{/each}}
      </div>
      <div class="${cnDialogArea('footer')}">
        {{{dialogForm}}}
      </div>
    </div>
    `;

    return this.compile(template);
  }
}
