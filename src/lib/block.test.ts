import { expect } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import type { Block as BlockType } from './block';

const eventBusMock = {
  on: sinon.fake(),
  emit: sinon.fake(),
};

const { Block } = proxyquire('./block', {
  'lib/event-bus': {
    EventBus: class {
      emit = (v: any) => {
        return eventBusMock.emit(v);
      };
      on = eventBusMock.on;
    },
  },
}) as { Block: typeof BlockType };

describe('block', () => {
  class MockComponent extends Block {
    constructor(props: any) {
      super(props);
    }
  }

  it('Должен вызывать init() при инициализации', () => {
    const component = new MockComponent({});
    void component;

    expect(eventBusMock.emit.calledWith(Block.EVENTS.INIT)).to.eq(true);
  });
});
