import { Block } from 'lib/block';
import { cn } from 'utils/bem';

import './styles.pcss';

type AvatarProps = {
  className?: string;
  src: string;
  label?: string;
};

const cnAvatar = cn('Avatar');

export class Avatar extends Block<AvatarProps> {
  render() {
    const { className, label, src } = this.props;

    const template = `
    <img class="${cnAvatar('', [className])}" src="${src}" alt="${label ?? 'Аватар'}">`;

    return this.compile(template, {});
  }
}
