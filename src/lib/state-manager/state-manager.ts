import { Action, Reducer, Reducers, Store } from './types';

export const createStore = <S, A extends Action>(initialState: S, reducer: Reducer<S, A>): Store<S, A> => {
  let state: S = initialState;

  return {
    getState: (): S => state,
    dispatch: (action: A): void => {
      state = reducer(state, action);
    },
  };
};

export const combineReducers = <S, A extends Action>(reducers: Reducers<S, A>): Reducer<S, A> => {
  return (state: S, action: A): S => {
    let hasChanged = false;
    const nextState: Partial<S> = {};

    for (const key in reducers) {
      nextState[key] = reducers[key](state[key], action);
      hasChanged = hasChanged || nextState[key] !== state[key];
    }

    return hasChanged ? (nextState as S) : state;
  };
};
