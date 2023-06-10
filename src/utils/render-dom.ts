import { ROOT_SELECTOR } from 'constants';
import { AppContainer } from 'containers/app';
import { Block } from 'lib/block';

export function renderDOM(pageComponent: Block, selector: string = ROOT_SELECTOR) {
  const rootElement = document.querySelector(selector);

  if (!rootElement) {
    throw new Error(`Root element is not found`);
  }

  const appContainerBlock = new AppContainer({
    page: pageComponent,
  });

  rootElement.replaceChildren(appContainerBlock.getContent());
  appContainerBlock.emitComponentDidMount();

  return rootElement;
}
