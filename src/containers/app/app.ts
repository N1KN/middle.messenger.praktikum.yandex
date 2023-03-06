import { Block, IBlockProps } from 'lib/block';
import { AppContainerTemplate } from './app.tpl';

import './styles.pcss';

type AppContainerProps = {
  page: Block;
};
export class AppContainer extends Block<AppContainerProps> {
  constructor(props: IBlockProps<AppContainerProps>) {
    const children = {
      page: props.page,
    };
    super({
      ...props,
      children,
    });
  }

  protected render() {
    return this.compile(AppContainerTemplate, {
      ...this.props,
    });
  }
}
