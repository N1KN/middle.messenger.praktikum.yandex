import { RouteNames } from 'app-constants/router';
import { LinkButton } from 'components/link-button';
import { Block, IBlockProps } from 'lib/block';
import { getUrlByRoute } from 'lib/router';
import { internalErrorPageTemplate } from './internal-error.tpl';

import './styles.pcss';

type InternalErrorPageProps = {
  errorNumber?: number;
};

const chatsLink = getUrlByRoute(RouteNames.CHATS);

export class InternalErrorPage extends Block<InternalErrorPageProps> {
  constructor(props: IBlockProps<InternalErrorPageProps> = {}) {
    super(props);
  }

  protected render(): DocumentFragment {
    const { errorNumber = 500 } = this.props;

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

    return this.compile(internalErrorPageTemplate, {
      errorNumber: fixedErrorNumber,
      chatsLinkButton: new LinkButton({ url: chatsLink, text: 'Назад к чатам' }).getContent().outerHTML,
    });
  }
}
