import { Button } from 'components/button';
import { Block } from 'lib/block';
import { cn } from 'utils/bem';

import './styles.pcss';

type DialogFormProps = {
  className?: string;
};

const cnDialogForm = cn('DialogForm');

export class DialogForm extends Block<DialogFormProps> {
  constructor(props: DialogFormProps) {
    const events = {
      submit: (e: SubmitEvent) => {
        const targetInput = (e.target as HTMLElement).querySelector('input')!;
        // TODO: Реализовать работу с сервером
        // eslint-disable-next-line no-console
        console.log('Message: ', { form: e.target, [targetInput.name]: targetInput.value });
      },
    };

    super({ ...props, events });
  }

  protected init() {
    this.children = {
      // TODO: Реализовать добавление файлов
      // attachBtn: new Button({
      //   className: cnDialogForm('button'),
      //   label: 'Прирепить файл',
      // }),
      sendBtn: new Button({
        className: cnDialogForm('button'),
        isSubmit: true,
        label: 'Отправить сообщение',
      }),
    };
  }

  render() {
    const { className } = this.props;

    const template = `
      <form name="messageForm" class="${cnDialogForm('', [className])}">
        {{{attachBtn}}}
        <input class="${cnDialogForm(
          'input',
        )}" name="message" type="text" autocomplete="off" placeholder="Введите сообщение" required="">
        {{{sendBtn}}}
      </form>`;

    return this.compile(template, {});
  }
}
