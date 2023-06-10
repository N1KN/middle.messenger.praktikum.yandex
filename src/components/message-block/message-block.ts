import { MESSAGE_MONTHS } from 'app-constants/common';
import { Block } from 'lib/block';
import { cn } from 'utils/bem';
import { addLeadingZero, getDate } from 'utils/common';

import './styles.pcss';

type MessageBlockProps = {
  className?: string;
  isMine?: boolean;
  content: string;
  time: string;
  isRead?: boolean;
  isFirstMessageAtTime?: boolean;
};

const cnMessageBlock = cn('MessageBlock');

export class MessageBlock extends Block<MessageBlockProps> {
  constructor(props: MessageBlockProps) {
    super(props);
  }

  render() {
    const { className, content, time, isRead, isMine, isFirstMessageAtTime } = this.props ?? {};

    const date = getDate(time);

    const centralDate = isFirstMessageAtTime
      ? `<p class="${cnMessageBlock('centralDate')}">${addLeadingZero(date.day)} ${MESSAGE_MONTHS[date.month]}</p>`
      : '';

    const template = `
    <div class="${cnMessageBlock('', { isMine }, [className])}" data-chat-id="{{chatId}}">
<!--      <li class="message ">-->
        ${centralDate}
        <p class="${cnMessageBlock('content', {
          isMine,
          isRead,
        })}"> {{content}} <time class="${cnMessageBlock('time')}">${addLeadingZero(date.hour)}:${addLeadingZero(
      date.minute,
    )}</time></p>
<!--      </li>-->
    </div>`;

    return this.compile(template, { content });
  }
}
