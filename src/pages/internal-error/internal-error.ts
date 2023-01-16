import Handlebars from 'handlebars';
import { LinkButton } from 'components/link-button';
import { getUrlByRoute, RouteNames } from 'utils/router';
import { internalErrorPageTemplate, InternalErrorPageTemplateProps } from './internal-error.tpl';
import './styles.pcss';

type InternalErrorPageProps = {
    errorNumber?: number;
};

const chatsLink = getUrlByRoute(RouteNames.CHATS);

export const InternalErrorPage = ({ errorNumber = 500 }: InternalErrorPageProps = {}) => {
    const fixedErrorNumber = ((value: number) => {
        const absoluteValue = Math.abs(value);

        if (absoluteValue <= 9) {
            return `50${Math.abs(errorNumber)}`;
        }

        if (absoluteValue <= 99) {
            return `5${Math.abs(errorNumber)}`;
        }

        return `${Math.abs(errorNumber)}`;
    })(errorNumber);

    return Handlebars.compile<InternalErrorPageTemplateProps>(internalErrorPageTemplate)({
        errorNumber: fixedErrorNumber,
        chatsLinkButton: LinkButton({url: chatsLink, text: 'Назад к чатам'}),
    });
};
