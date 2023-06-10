export type Action<T = any> = {
  type: T;
};

export type ActionWithPayload<T = any, P = any> = Action<T> & {
  payload: P;
};

export type Actions<T extends keyof any = string> = Record<T, ActionWithPayload>;

export interface ActionCreator<P, T extends string = string> {
  type: T;
  (payload: P): ActionWithPayload<T, P>;
}

export type Reducer<S = any, A extends Action = Action, PreloadedState = S> = (
  state: S | PreloadedState | undefined,
  action: A,
) => S;

export type Listener<S> = (state: S) => void;

export interface Store<S, A> {
  dispatch: (action: A) => void;
  getState: () => S;
  subscribe: (listener: Listener<S>) => () => void;
}

export type ActionsMap<S, A extends Action> = {
  [K in A['type']]?: (state: S, action: A) => S;
};

export type ReducersMap<S, A extends Action> = {
  [K in keyof S]: Reducer<S[K], A>;
};
