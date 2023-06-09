import { Action, ActionCreator, ActionsMap, ActionWithPayload, Listener, Reducer, ReducersMap, Store } from './types';

export function createAction<P, T extends string>(type: T): ActionCreator<P, T> {
  const actionCreator = (payload: P): Action<T> & ActionWithPayload<T, P> => {
    return { type, payload };
  };

  actionCreator.type = type;

  actionCreator.match = (action: Action<string>): action is ActionWithPayload<string, P> => {
    return action.type === type;
  };

  return actionCreator;
}

export function createReducer<S, A extends Action = ActionWithPayload>(
  initialState: S,
  actionsMap: ActionsMap<S, A>,
): Reducer<S, A> {
  return (state = initialState, action): S => {
    const reducer = actionsMap[action.type as keyof ActionsMap<S, A>];
    return reducer ? reducer(state, action) : state;
  };
}

export function combineReducers<S, A extends ActionWithPayload>(reducers: ReducersMap<S, A>): Reducer<S, A> {
  return (state: S | undefined, action: A): S => {
    const newState = {} as S;
    for (const key in reducers) {
      newState[key] = reducers[key](state ? state[key] : undefined, action);
    }
    return newState;
  };
}

export function createStore<S, A extends Action>(reducer: Reducer<S, A>): Store<S, A> {
  let state = reducer(undefined, { type: '@@INIT' } as A);
  const listeners: Listener<S>[] = [];

  const dispatch = (action: A) => {
    state = reducer(state, action);
    listeners.forEach((listener) => listener(state));
  };

  const getState = () => state;

  const subscribe = (listener: Listener<S>) => {
    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      listeners.splice(index, 1);
    };
  };

  return { dispatch, getState, subscribe };
}
