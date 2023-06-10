import { RouteNames } from 'constants/router';
import { LinkButton } from 'components/link-button';
import { Block } from 'lib/block';
import { getUrlByRoute } from 'utils/router';
import { notFoundPageTemplate } from './not-found.tpl';

import './styles.pcss';

const chatsLink = getUrlByRoute(RouteNames.CHATS);

export class NotFoundPage extends Block {
  protected init() {
    this.children.chatsLinkButton = new LinkButton({ url: chatsLink, text: 'Назад к чатам' });
  }

  render() {
    return this.compile(notFoundPageTemplate);
  }
}
