import { cn } from 'utils/bem';
import { GetTemplateProps } from 'types/common';

import './styles.pcss';

const templateProps = {
    additionalClassName: '{{additionalClassName}}',
    url: '{{url}}',
    text: '{{text}}'
} as const;

export const cnLinkButton = cn('LinkButton')
export const linkButtonTemplate = `
<a href="${templateProps['url']}" class="${cnLinkButton()}${templateProps['additionalClassName']}" tabindex="0">
  ${templateProps['text']}
</a>`;

export type LinkButtonTemplateProps = GetTemplateProps<typeof templateProps>;