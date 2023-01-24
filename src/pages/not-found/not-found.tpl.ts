import { cn } from 'utils/bem';
import { GetTemplateProps } from 'types/common';

const templateProps = {
    chatsLinkButton: '{{{chatsLinkButton}}}',
} as const;

const cnNotFoundPage = cn('NotFoundPage');
export const notFoundPageTemplate = `
<main class="${cnNotFoundPage()}">
    <h1 class="${cnNotFoundPage('title')}">404</h1>
    <p class="${cnNotFoundPage('subtitle')}">Не туда попали</p>
    ${templateProps['chatsLinkButton']}
</main>
`;

export type NotFoundPageProps = GetTemplateProps<typeof templateProps>;
