import { Spinner } from 'components/spinner';
import { Block, IBlockProps, OnUpdateProps } from 'lib/block';
import { store } from 'store';
import { AppContainerTemplate } from './app.tpl';

import './styles.pcss';

type AppContainerProps = {
  page: Block;
};

type AppContainerState = {
  authChecked: boolean;
};
export class AppContainer extends Block<AppContainerProps, AppContainerState> {
  constructor(props: IBlockProps<AppContainerProps>) {
    const children = {
      page: new Spinner({}),
    };
    super({
      ...props,
      children,
    });
  }

  protected init() {
    this.state.authChecked = store.getState().auth.authChecked;
    const unsubscribe = store.subscribe((state) => {
      if (this.state.authChecked !== state.auth.authChecked) {
        this.state.authChecked = state.auth.authChecked;
      }
    });

    this.addToUnmountQueue(unsubscribe);
  }

  protected componentDidUpdate({ oldTarget, target, type }: OnUpdateProps): boolean {
    if (type === Block.UPDATE_EVENTS.STATE) {
      const newComponent = this.state.authChecked ? this.props.page : new Spinner({});

      if (newComponent.id !== (this.children.page as Block).id) {
        (this.children.page as Block).emitComponentWillUnmount();
        this.children.page = newComponent;
        (this.children.page as Block).emitComponentDidMount();
      }
    }

    return super.componentDidUpdate({ oldTarget, target, type });
  }

  protected render() {
    return this.compile(AppContainerTemplate, {
      ...this.props,
    });
  }
}
