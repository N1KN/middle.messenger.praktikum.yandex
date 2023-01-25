import Handlebars from 'handlebars';
import { cn } from 'utils/bem';

type DividerProps = {
  className?: string;
};

const cnDivider = cn('Divider');

export const Divider = ({ className }: DividerProps = {}) => {
  const template = `<div class="${cnDivider('', [className])}" /></div>`;
  return Handlebars.compile(template)({});
};
