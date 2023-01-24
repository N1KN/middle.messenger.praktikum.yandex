import { GetTemplateProps } from 'types/common';
import { cn } from 'utils/bem';

const templateProps = {
  page: '{{{page}}}',
} as const;

const cnAppContainer = cn('AppContainer');

export const AppContainerTemplate = `
<div class="${cnAppContainer()}">
    ${templateProps['page']}
</div>`;

export type AppContainerTemplateProps = GetTemplateProps<typeof templateProps>;
