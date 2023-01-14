import { cn } from 'utils/bem';
import { GetTemplateProps } from 'types/common';

const templateProps = {
    id: '{{id}}',
    value: '{{value}}'
} as const;

const cnButton = cn('Button');
export const buttonTemplate = `
<button class="${cnButton()}">
${templateProps['value']}
</button>`;

export const buttonTemplateWithId = `
<button id="${templateProps['id']}" class="${cnButton()}">
${templateProps['value']}
</button>`;

export type ButtonTemplateProps = GetTemplateProps<typeof templateProps>;