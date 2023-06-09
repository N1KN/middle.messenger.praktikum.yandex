import { Block } from 'lib/block';
import { cn } from 'utils/bem';

import './styles.pcss';

type SpinnerProps = {
  className?: string;
};

const cnSpinner = cn('Spinner');

export class Spinner extends Block<SpinnerProps> {
  constructor(props: SpinnerProps) {
    super(props);
  }

  render() {
    const { className } = this.props;

    const template = `<div class="${cnSpinner('', [className])}" /></div>`;
    return this.compile(template);
  }
}
