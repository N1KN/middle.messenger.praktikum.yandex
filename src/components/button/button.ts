import { Block } from 'lib/block';
import { cn } from 'utils/bem';

import './styles.pcss';

type ButtonProps = {
  className?: string;
  id?: string;
  label: string;
  onClick?: (e: MouseEvent) => void;
};

const cnButton = cn('Button');

export class Button extends Block<ButtonProps> {
  constructor(props: ButtonProps) {
    const { onClick, ...otherProps } = props;
    const events = {
      click: (e: MouseEvent) => {
        onClick && onClick(e);
      },
    };
    super({ ...otherProps, events });
  }

  render() {
    const { className, label, id } = this.props;
    const idAttr = id ? `id="${id}"` : '';

    const template = `
        <button ${idAttr} class="${cnButton('', [className])}">
        ${label}
        </button>`;

    return this.compile(template, {});
  }
}
