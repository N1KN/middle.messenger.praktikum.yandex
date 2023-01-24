import Handlebars from 'handlebars';
import { cn } from 'utils/bem';

import './styles.pcss';

type ButtonProps = {
  className?: string;
  id?: string;
  text: string;
};

const cnButton = cn('Button');

export const Button = ({ id, text }: ButtonProps) => {
  const idAttr = id ? `id="${id}"` : '';

  const template = `
        <button ${idAttr} class="${cnButton()}">
        ${text}
        </button>`;

  return Handlebars.compile(template)({});
};
