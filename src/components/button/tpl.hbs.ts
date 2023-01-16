import { cn } from 'utils/bem';
import { GetTemplateProps } from 'types/common';

const templateProps = {
    id: '{{id}}',
    text: '{{text}}'
} as const;

const cnButton = cn('Button');
export const buttonTemplate = `
<button class="${cnButton()}">
${templateProps['text']}
</button>`;

export const buttonTemplateWithId = `
<button id="${templateProps['id']}" class="${cnButton()}">
${templateProps['text']}
</button>`;

export type ButtonTemplateProps = GetTemplateProps<typeof templateProps>;