import { Block } from 'lib/block';
import { cn } from 'utils/bem';

type DividerProps = {
  className?: string;
};

const cnDivider = cn('Divider');

export class Divider extends Block<DividerProps> {
  constructor(props: DividerProps) {
    super(props);
  }

  render() {
    const { className } = this.props;

    const template = `<div class="${cnDivider('', [className])}" /></div>`;
    return this.compile(template);
  }
}
