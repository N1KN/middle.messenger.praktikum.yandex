import Handlebars from 'handlebars';
import { cn } from 'utils/bem';

import './styles.pcss';

type PageWrapperWithBackButtonProps = {
    pageContent: string;
    backBtnUrl: string;
};

const cnPageWrapperWithBackButton = cn('PageWrapperWithBackButton');

export const PageWrapperWithBackButton = ({ pageContent, backBtnUrl }: PageWrapperWithBackButtonProps) => {

    const template = `
    <div class="${cnPageWrapperWithBackButton()}">
        <a class="${cnPageWrapperWithBackButton('backButtonWrapper')}" href="{{backBtnUrl}}">
            <div class="${cnPageWrapperWithBackButton('backButton')}"></div>
        </a>
        <div class="${cnPageWrapperWithBackButton('pageWrapper')}">
            {{{pageContent}}}
        </div>
    </div>`;

    return Handlebars.compile(template)({
        pageContent,
        backBtnUrl
    });
};

