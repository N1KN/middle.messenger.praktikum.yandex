import Handlebars from 'handlebars';
import { cn } from 'utils/bem';

import './styles.pcss';

type PageWrapperWithBackButtonProps = {
  pageContent: string;
  backBtnUrl: string;
  backBtnLabel?: string;
};

const cnPageWrapperWithBackButton = cn('PageWrapperWithBackButton');

export const PageWrapperWithBackButton = ({pageContent, backBtnUrl, backBtnLabel}: PageWrapperWithBackButtonProps) => {
  const ariaLabelAttr = backBtnLabel ? `aria-label="{{{backBtnLabel}}}"` : '';

  const template = `
    <div class="${cnPageWrapperWithBackButton()}">
        <a class="${cnPageWrapperWithBackButton('backButtonWrapper')}" href="{{backBtnUrl}}" ${ariaLabelAttr}>
            <div class="${cnPageWrapperWithBackButton('backButton')}"></div>
        </a>
        <main class="${cnPageWrapperWithBackButton('pageWrapper')}">
            {{{pageContent}}}
        </main>
    </div>`;

  return Handlebars.compile(template)({
    pageContent,
    backBtnUrl,
    backBtnLabel
  });
};

