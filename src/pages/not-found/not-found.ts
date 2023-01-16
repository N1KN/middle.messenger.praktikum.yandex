import Handlebars from 'handlebars';
import { LinkButton } from 'components/link-button';
import { getUrlByRoute, RouteNames } from 'utils/router';
import { NotFoundPageProps, notFoundPageTemplate } from './not-found.tpl';
import './styles.pcss';

const chatsLink = getUrlByRoute(RouteNames.CHATS);

export const NotFoundPage = () => {
    return Handlebars.compile<NotFoundPageProps>(notFoundPageTemplate)({
        chatsLinkButton: LinkButton({ url: chatsLink, text: 'Назад к чатам' }),
    });
};
