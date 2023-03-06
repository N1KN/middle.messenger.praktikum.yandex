import { Block, IBlockProps } from 'lib/block';
import { linkButtonTemplate } from './link-button.tpl';

import './styles.pcss';

type LinkButtonProps = {
  className?: string;
  url: string;
  text: string;
};

export class LinkButton extends Block<LinkButtonProps> {
  constructor(props: IBlockProps<LinkButtonProps>) {
    super(props);
  }

  render() {
    const { url, text, className } = this.props;
    const additionalClassName = className ? ` ${className}` : '';
    return this.compile(linkButtonTemplate, { url, text, additionalClassName });
  }
}
