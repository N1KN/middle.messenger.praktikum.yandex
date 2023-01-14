import { cn } from 'utils/bem';
import { GetTemplateProps } from 'types/common';

const templateProps = {
    page: '{{{page}}}',
} as const;

const cnAppContainer = cn('AppContainer');

export const AppContainerTemplate = `
<div class="${cnAppContainer()}">
    ${templateProps['page']}
</div>`;

export type AppContainerTemplateProps = GetTemplateProps<typeof templateProps>;