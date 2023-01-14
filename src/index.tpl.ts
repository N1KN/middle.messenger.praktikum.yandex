import { cn } from 'utils/bem';

const cnApp = cn('App');

export const AppTemplate = `
<div class="${cnApp()}">
    {{{page1}}}
</div>`;
