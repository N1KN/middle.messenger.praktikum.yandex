import { Block, IBlockProps } from 'lib/block';
import { cn } from 'utils/bem';

import './styles.pcss';

type PageWrapperWithBackButtonProps = {
  pageContentTemplate: string;
  children: Record<string, Block | Block[]>;
  backBtnUrl: string;
  backBtnLabel?: string;
};

const cnPageWrapperWithBackButton = cn('PageWrapperWithBackButton');

export class PageWrapperWithBackButton extends Block<PageWrapperWithBackButtonProps> {
  constructor(props: IBlockProps<PageWrapperWithBackButtonProps>) {
    super(props);
  }

  render() {
    const { pageContentTemplate, backBtnUrl, backBtnLabel } = this.props;
    const ariaLabelAttr = backBtnLabel ? `aria-label="{{{backBtnLabel}}}"` : '';

    const template = `
    <div class="${cnPageWrapperWithBackButton()}">
        <a class="${cnPageWrapperWithBackButton('backButtonWrapper')}" href="{{backBtnUrl}}" ${ariaLabelAttr}>
            <div class="${cnPageWrapperWithBackButton('backButton')}"></div>
        </a>
        <main class="${cnPageWrapperWithBackButton('pageWrapper')}">
            ${pageContentTemplate}
        </main>
    </div>`;

    return this.compile(template, {
      ...this.props,
      backBtnUrl,
      backBtnLabel,
    });
  }
}
