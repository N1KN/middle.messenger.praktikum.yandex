import { cn } from 'utils/bem';
import { GetTemplateProps } from 'types/common';

const templateProps = {
    chatsLinkButton: '{{{chatsLinkButton}}}',
} as const;

const cnNotFoundPage = cn('NotFoundPage');
export const notFoundPageTemplate = `
<div class="${cnNotFoundPage()}">
    <h1 class="${cnNotFoundPage('title')}">Ошибка 404</h1>
    <p class="${cnNotFoundPage('subtitle')}">Не туда попали</p>
    ${templateProps['chatsLinkButton']}
</div>
`;

export type NotFoundPageProps = GetTemplateProps<typeof templateProps>;