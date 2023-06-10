import { Block } from 'lib/block';
import { isEqual } from './common';
import { renderDOM } from './render-dom';

export class Route {
  private _block: Block | null = null;

  constructor(private _pathname: string, private blockClass: typeof Block<any>, private props: Record<any, any> = {}) {}

  public leave() {
    this._block?.emitComponentWillUnmount();
    this._block = null;
  }

  public getBlock() {
    return this._block;
  }

  public match(pathname: string) {
    return isEqual(pathname, this._pathname);
  }

  public render() {
    if (!this._block) {
      this._block = new this.blockClass(this.props);
      renderDOM(this._block);
    }
  }
}
