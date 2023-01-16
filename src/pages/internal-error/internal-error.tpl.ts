import { cn } from 'utils/bem';
import { GetTemplateProps } from 'types/common';

const templateProps = {
    errorNumber: '{{{errorNumber}}}',
    chatsLinkButton: '{{{chatsLinkButton}}}',
} as const;

const cnInternalErrorPage = cn('InternalErrorPage');
export const internalErrorPageTemplate = `
<div class="${cnInternalErrorPage()}">
    <h1 class="${cnInternalErrorPage('title')}">${templateProps['errorNumber']}</h1>
    <p class="${cnInternalErrorPage('subtitle')}">Уже фиксим</p>
    ${templateProps['chatsLinkButton']}
</div>
`;

export type InternalErrorPageTemplateProps = GetTemplateProps<typeof templateProps>;