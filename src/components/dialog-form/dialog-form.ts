import { Button } from 'components/button';
import { Block } from 'lib/block';
import { FormHandler } from 'lib/form-validator';
import { cn } from 'utils/bem';

import './styles.pcss';

type DialogFormProps = {
  className?: string;
  onSubmit: (text: string) => void;
};

const cnDialogForm = cn('DialogForm');

export class DialogForm extends Block<DialogFormProps> {
  private _formHandler?: FormHandler;

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

  private resetFormListeners() {
    const form = this.element;
    if (form instanceof HTMLFormElement) {
      this._formHandler?.removeListeners(form);
      this._formHandler?.setListeners(form);
    }
  }

  componentDidMount() {
    this._formHandler = new FormHandler({
      onlyConfiguredKeys: false,
      form: (this.element as HTMLFormElement)!,
    });
    this.resetFormListeners();
    this._formHandler.subscribeSubmit(({ message }) => {
      this.props.onSubmit && this.props.onSubmit(message);

      this.element.querySelector('input')!.value = '';
    });
  }
  render() {
    const { className } = this.props;

    const template = `
      <form name="messageForm" class="${cnDialogForm('', [className])}" onsubmit="return false">
        {{{attachBtn}}}
        <input class="${cnDialogForm(
          'input',
        )}" name="message" type="text" autocomplete="off" placeholder="Введите сообщение" required="">
        {{{sendBtn}}}
      </form>`;

    return this.compile(template, {});
  }
}
