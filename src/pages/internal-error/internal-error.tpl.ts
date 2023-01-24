import { GetTemplateProps } from 'types/common';
import { cn } from 'utils/bem';

const templateProps = {
  errorNumber: '{{{errorNumber}}}',
  chatsLinkButton: '{{{chatsLinkButton}}}',
} as const;

const cnInternalErrorPage = cn('InternalErrorPage');
export const internalErrorPageTemplate = `
<main class="${cnInternalErrorPage()}">
    <h1 class="${cnInternalErrorPage('title')}">${templateProps['errorNumber']}</h1>
    <p class="${cnInternalErrorPage('subtitle')}">Уже фиксим</p>
    ${templateProps['chatsLinkButton']}
</main>
`;

export type InternalErrorPageTemplateProps = GetTemplateProps<typeof templateProps>;
