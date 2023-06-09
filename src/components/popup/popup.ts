import { Block, IBlockProps } from 'lib/block';
import { FormHandler } from 'lib/form-validator';
import { cn } from 'utils/bem';

import './styles.pcss';

type PopupProps = {
  title: string;
  content?: Block[];
  button: Block;
  onClose: () => void;
  onSubmit?: <T extends Record<string, any>>(data: T) => void;
};

const cnPopup = cn('Popup');

export class Popup extends Block<PopupProps> {
  private _formHandler?: FormHandler;

  constructor(props: PopupProps) {
    const events: IBlockProps['events'] = {
      click: (e: MouseEvent) => {
        if ((e.target as HTMLElement).classList.contains(cnPopup('overlay'))) {
          e.stopPropagation();
          this.props.onClose();
        }
        //
      },
    };

    const children: Record<string, Block | Block[]> = {
      button: props.button,
      content: props.content ?? [],
    };

    super({ ...props, children, events });

    this.hide();
  }

  private resetFormListeners() {
    const form = this.element.querySelector('form');
    if (form instanceof HTMLFormElement) {
      this._formHandler?.removeListeners(form);
      this._formHandler?.setListeners(form);
    }
  }

  componentDidMount() {
    this._formHandler = new FormHandler({
      onlyConfiguredKeys: false,
      form: this.element.querySelector('form')!,
    });
    this.resetFormListeners();
    this._formHandler.subscribeSubmit((data) => {
      this.props.onSubmit && this.props.onSubmit(data);
    });
  }

  render() {
    const template = `
    <div class="${cnPopup('', { isOpened: false })}">
      <div class="${cnPopup('overlay')}"></div>
      <div class="${cnPopup('window')}">
        <h4 class="${cnPopup('title')}">{{ title }}</h4>
        <form class="${cnPopup('form')}" novalidate="" onsubmit="return false">
            {{{ close }}}
          <div class="${cnPopup('content')}">
            {{#each content}}
                {{{this}}}
            {{/each}}
          </div>
          <div class="${cnPopup('buttons')}">{{{ button }}}</div>
        </form>
      </div>
    </div>`;

    return this.compile(template, { ...this.props });
  }
}
