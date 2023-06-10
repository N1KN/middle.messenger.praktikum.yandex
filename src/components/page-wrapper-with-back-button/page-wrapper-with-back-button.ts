import { Block, IBlockProps } from 'lib/block';
import { RouterInstance } from 'lib/router';
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
    const events: IBlockProps['events'] = {
      click: (e: MouseEvent) => {
        if ((e.composedPath() as HTMLElement[]).some((el) => el.getAttribute?.('id') === 'backBtn')) {
          e.stopPropagation();
          RouterInstance.go(this.props.backBtnUrl);
        }
      },
    };

    super({ ...props, events });
  }

  render() {
    const { pageContentTemplate, backBtnLabel } = this.props;
    const ariaLabelAttr = backBtnLabel ? `aria-label="{{{backBtnLabel}}}"` : '';

    const template = `
    <div class="${cnPageWrapperWithBackButton()}">
        <a id="backBtn" class="${cnPageWrapperWithBackButton('backButtonWrapper')}" href="#" ${ariaLabelAttr}>
            <div class="${cnPageWrapperWithBackButton('backButton')}"></div>
        </a>
        <main class="${cnPageWrapperWithBackButton('pageWrapper')}">
            ${pageContentTemplate}
        </main>
    </div>`;

    return this.compile(template, {
      ...this.props,
      backBtnLabel,
    });
  }
}
