import { Block, IBlockProps } from 'lib/block';
import { cn } from 'utils/bem';

import './styles.pcss';

type EditAvatarProps = {
  className?: string;
  avatarUrl: string;
  label?: string;

  onClick?: () => void;
};

const cnEditAvatar = cn('EditAvatar');

export class EditAvatar extends Block<EditAvatarProps> {
  constructor(props: EditAvatarProps) {
    const events: IBlockProps['events'] = {
      click: (e: MouseEvent) => {
        e.stopPropagation();
        this.props.onClick?.();
      },
    };
    super({ ...props, events });
  }

  render() {
    const { className, label, avatarUrl } = this.props;

    const template = `
    <div class="${cnEditAvatar('', [className])}">
        <img src="{{{avatarUrl}}}" alt="{{{label}}}" />
        <div class="${cnEditAvatar('label')}">Поменять аватар</div>
    </div>`;

    return this.compile(template, { avatarUrl, label: label ?? 'Аватар' });
  }
}
