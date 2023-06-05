export type Action<T = string, P = any> = {
  type: T;
  payload?: P;
};

export type Reducer<S, A extends Action> = (state: S, action: A) => S;

export type Store<S, A extends Action> = {
  getState(): S;
  dispatch(action: A): void;
};

export type Reducers<S, A extends Action> = {
  [K in keyof S]: Reducer<S[K], A>;
};
