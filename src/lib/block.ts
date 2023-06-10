import { FORCE_HIDDEN_CLASS } from 'constants';
import Handlebars from 'handlebars';
import { EventBus } from 'lib/event-bus';
import { isEqual } from 'utils/common';

export type IBlockProps<PROPS = { [key: string]: any }> = {
  attributes?: any;
  children?: Record<string, Block<any> | Block<any>[]>;
  events?: Record<string, ((arg: any) => void)[] | ((arg: any) => void)>;
  className?: string;
} & PROPS;

export type OnUpdateProps = {
  type: (typeof Block.UPDATE_EVENTS)[keyof typeof Block.UPDATE_EVENTS];
  oldTarget: any;
  target: any;
};

const uuid = function uuid() {
  return (`${1e7}` + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (Number(c) ^ (window.crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (Number(c) / 4)))).toString(16),
  );
};

export class Block<
  PROPS extends IBlockProps = Record<string, any>,
  STATE extends Record<string, any> = Record<string, any>,
> {
  private readonly _meta: { children: Required<IBlockProps>['children']; props: PROPS; state: STATE } = {
    children: {},
    props: {} as PROPS,
    state: {} as STATE,
  };
  public get props() {
    return this._meta.props;
  }

  public get state() {
    return this._meta.state;
  }

  public get children() {
    return this._meta.children;
  }

  protected readonly eventBus = new EventBus();
  private _id = uuid();
  public get id() {
    return this._id;
  }

  private _element!: HTMLElement;
  // Селектор элемента внутри this._element на котором будут срабатывать добавленные события
  private readonly _elementSelectorForEvents?: string | null;

  static EVENTS = {
    INIT: 'init',
    FLOW_CDM: 'flow:component-did-mount',
    FLOW_CDU: 'flow:component-did-update',
    FLOW_CWU: 'flow:component-will-unmount',
    FLOW_RENDER: 'flow:render',
  };

  static UPDATE_EVENTS = {
    STATE: 'state' as const,
    PROPS: 'props' as const,
    CHILDREN: 'children' as const,
  };

  private _unmountQueue = new Set<() => void>();
  constructor(propsAndChildren: IBlockProps<PROPS> = {} as PROPS, targetSelectorForEvents?: string) {
    const { children, props } = this._getPropsAndChildren(propsAndChildren);
    this.eventBus = new EventBus();
    this._meta = {
      props,
      children,
      state: {} as STATE,
    };
    this._meta.props = this._makePropsProxy({ ...props, _id: this._id }, 'props');
    this._meta.children = this._makePropsProxy({ ...children }, 'children');
    this._meta.state = this._makePropsProxy({}, 'state') as unknown as STATE;
    this._registerEvents(this.eventBus);

    this._elementSelectorForEvents = targetSelectorForEvents;

    this.eventBus.emit(Block.EVENTS.INIT);
  }

  setChildren(nextState: Required<IBlockProps>['children']) {
    if (!nextState) {
      return;
    }

    Object.assign(this.children, nextState);
  }

  setProps(nextProps: PROPS | ((prevProps: PROPS) => PROPS)) {
    if (!nextProps) {
      return;
    }

    if (typeof nextProps === 'function') {
      const result = nextProps({ ...this.props });
      Object.assign(this.props, result);
      return;
    }

    Object.assign(this.props, nextProps);
  }

  protected setState(nextState: Partial<STATE>) {
    if (!nextState) {
      return;
    }

    Object.assign(this.state, nextState);
  }

  private _getPropsAndChildren(propsAndChildren: IBlockProps): {
    children: Required<IBlockProps>['children'];
    props: PROPS;
  } {
    const props: Record<string, any> = {};
    const children: Record<string, Block> | Record<string, Block[]> = {};
    Object.entries(propsAndChildren).forEach(([key, value]) => {
      // Проверяем наличие в пропсах ключа children и если такой ключ есть, то пытаемся получить валидные инстансы класса Block
      if (key === 'children' && typeof value === 'object') {
        Object.entries(value).forEach(([childKey, childValue]) => {
          if (Array.isArray(childValue)) {
            children[childKey] = childValue.filter((c) => c instanceof Block);
          } else if (childValue instanceof Block) {
            children[childKey] = childValue;
          }
        });
        return;
      }

      props[key] = value;
    });
    return { children, props } as { children: Required<IBlockProps>['children']; props: PROPS };
  }

  private _registerEvents(eventBus: EventBus) {
    eventBus.on(Block.EVENTS.INIT, this._init.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CWU, this._componentWillUnmount.bind(this));
    eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
  }

  private _getElementForEvents() {
    const elementSelector = this._elementSelectorForEvents;
    if (elementSelector) {
      return this._element.querySelector(elementSelector) || this._element;
    }

    return this._element;
  }
  private _addEvents() {
    const targetElement = this._getElementForEvents();
    const events = this.props.events;
    if (events) {
      Object.keys(events).forEach((eventName) => {
        const eventsByType = events[eventName];
        if (Array.isArray(eventsByType)) {
          eventsByType.forEach((eventListener) => targetElement.addEventListener(eventName, eventListener));
        } else {
          targetElement.addEventListener(eventName, eventsByType);
        }
      });
    }
  }

  private _removeEvents() {
    const targetElement = this._getElementForEvents();
    const events = this.props.events;
    if (events) {
      Object.keys(events).forEach((eventName) => {
        const eventsByType = events[eventName];
        if (Array.isArray(eventsByType)) {
          eventsByType.forEach((eventListener) => targetElement.addEventListener(eventName, eventListener));
        } else {
          targetElement.removeEventListener(eventName, eventsByType);
        }
      });
    }
  }

  protected getState(): Partial<STATE> {
    return this.state;
  }
  protected getStateFromProps(props: PROPS): void {
    void props;
    this.setState({});
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  protected init() {}
  private _init() {
    this.init();

    this.eventBus.emit(Block.EVENTS.FLOW_RENDER);
  }

  private _componentDidMount() {
    this.componentDidMount();
    Object.values(this.children).forEach((children) => {
      if (Array.isArray(children)) {
        children.forEach((child) => child.emitComponentDidMount());
      } else {
        children.emitComponentDidMount();
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  protected componentDidMount() {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  protected componentWillUnmount() {}
  private _componentWillUnmount() {
    this._unmountQueue.forEach((func) => func());
    this._unmountQueue.clear();

    this.componentWillUnmount();

    Object.values(this.children).forEach((children) => {
      if (Array.isArray(children)) {
        children.forEach((child) => child.emitComponentWillUnmount());
      } else {
        children.emitComponentWillUnmount();
      }
    });
  }

  // Коллбэки, которые будут вызваны при размонтировании
  public addToUnmountQueue(func: () => void): void {
    this._unmountQueue.add(func);
  }

  public emitComponentWillUnmount() {
    this.eventBus.emit(Block.EVENTS.FLOW_CWU);
  }

  public emitComponentDidMount() {
    this.eventBus.emit(Block.EVENTS.FLOW_CDM);
  }

  private _componentDidUpdate({ oldTarget, target, type }: OnUpdateProps) {
    const shouldBeUpdated = this.componentDidUpdate({ oldTarget, target, type });
    if (shouldBeUpdated) {
      this.eventBus.emit(Block.EVENTS.FLOW_RENDER);
    }
  }

  protected componentDidUpdate({ oldTarget, target, type }: OnUpdateProps) {
    void type;
    return !isEqual(oldTarget, target);
  }

  get element() {
    return this._element;
  }

  protected compile(template: string, context: any = {}) {
    const contextAndStubs = { ...context };

    Object.entries(this.children).forEach(([name, component]) => {
      // contextAndStubs[name] = `<template data-id='${component.id}'></template>`;
      if (Array.isArray(component)) {
        contextAndStubs[name] = component.map((child) => `<template data-id='${child.id}'></template>`);
      } else {
        contextAndStubs[name] = `<template data-id='${component.id}'></template>`;
      }
    });

    const html = Handlebars.compile(template)(contextAndStubs);

    const tmpl = document.createElement('template');

    tmpl.innerHTML = html;

    const replaceStub = (component: Block) => {
      const stub = tmpl.content.querySelector(`template[data-id='${component.id}']`);

      if (!stub) {
        return;
      }

      component.getContent()?.append(...Array.from(stub.childNodes));

      stub.replaceWith(component.getContent()!);
    };

    Object.entries(this.children).forEach(([, component]) => {
      if (Array.isArray(component)) {
        component.forEach(replaceStub);
      } else {
        replaceStub(component);
      }
    });

    tmpl.content.querySelectorAll('template').forEach((template) => {
      console.error(
        'Внимание! После обработки шаблона остался элемент:',
        template,
        'На конечную страницу он не пропущен, но проверьте код.',
      );
      template.remove();
    });

    return tmpl.content;
  }

  private _render() {
    const selectorForEvents = this._elementSelectorForEvents;
    if (this._element) {
      this._removeEvents();
    }

    const fragment = this.render();
    if (!fragment.firstElementChild) {
      throw new Error('Ошибка! render() вернул не корректный компонент. ');
    }

    const newElement = fragment.firstElementChild as HTMLElement;

    if (selectorForEvents && !newElement?.querySelector(selectorForEvents)) {
      throw new Error(`Ошибка! По селектору: ${this._elementSelectorForEvents}] - не найден элемент.`);
    }

    if (this._element && newElement) {
      this._element.replaceWith(newElement);
    }

    this._element = newElement;
    this._addEvents();
  }

  protected render(): DocumentFragment | HTMLElement {
    return new DocumentFragment();
  }

  public getContent() {
    return this.element;
  }

  private _makePropsProxy(props: IBlockProps, type: 'state' | 'props' | 'children') {
    return new Proxy(props, {
      get: (target, prop: string) => {
        const value = target[prop];
        return typeof value === 'function' ? value.bind(this) : value;
      },
      set: (target: IBlockProps, prop: string, newValue) => {
        const oldTarget = { ...target };
        target[prop] = newValue;
        this.eventBus.emit(Block.EVENTS.FLOW_CDU, { type, oldTarget, target });
        return true;
      },
      deleteProperty() {
        throw new Error('Отказано в доступе');
      },
    }) as PROPS;
  }

  public show() {
    this.getContent()!.classList.remove(FORCE_HIDDEN_CLASS);
  }

  public hide() {
    this.getContent()!.classList.add(FORCE_HIDDEN_CLASS);
  }
}
