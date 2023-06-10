import { expect } from 'chai';
import { AnyBlockComponents, RouterInstance } from 'lib/router';
import sinon from 'sinon';
import { store } from 'store';
import { setAuthChecked } from 'store/auth/actions';

describe('Router', () => {
  store.dispatch(setAuthChecked(true));
  global.window.history.back = () => {
    if (typeof window.onpopstate === 'function') {
      window.onpopstate({ currentTarget: window } as unknown as PopStateEvent);
    }
  };
  global.window.history.forward = () => {
    if (typeof window.onpopstate === 'function') {
      window.onpopstate({ currentTarget: window } as unknown as PopStateEvent);
    }
  };

  const getContentFakeFirst = sinon.fake.returns(document.createElement('div'));
  const getContentFakeSecond = sinon.fake.returns(document.createElement('div'));

  const BlockMockFirst = class {
    public id = '';
    constructor() {
      this.id = '_first';
    }

    emitComponentDidMount() {
      //
    }
    emitComponentWillUnmount() {
      //
    }
    getContent = getContentFakeFirst;
  } as unknown as AnyBlockComponents;

  const BlockMockSecond = class {
    public id = '';
    constructor() {
      this.id = '_second';
    }

    emitComponentDidMount() {
      //
    }
    emitComponentWillUnmount() {
      //
    }
    getContent = getContentFakeSecond;
  } as unknown as AnyBlockComponents;

  it('use() должен возвращать экземпляр роутера', () => {
    const result = RouterInstance.use('', BlockMockFirst);
    RouterInstance.useAsNotFoundRoute('not-found', BlockMockSecond);

    expect(result).to.eq(RouterInstance);
  });

  it('должен рендерить страницу при вызове start()', () => {
    RouterInstance.start();

    expect(getContentFakeFirst.called).to.eq(true);
  });

  it('вторая страница не должна быть отрендерена без вызова', () => {
    expect(getContentFakeSecond.called).to.eq(false);
  });

  describe('.go()', () => {
    it('должен рендерить компонент при переходе на другую страницу', () => {
      RouterInstance.start();

      RouterInstance.go('not-found');

      expect(getContentFakeSecond.called).to.eq(true);
    });
  });
});
