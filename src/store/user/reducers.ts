import { createReducer } from 'lib/state-manager';
import { setUser } from './actions';
import { UserState } from './types';

const initialState: UserState = {
  userInfo: null,
  token: null,
};

const reducer = createReducer<UserState>(initialState, {
  [setUser.type]: (state, action: ReturnType<typeof setUser>) => {
    return { ...state, userInfo: action.payload };
  },
});

export const userReducer = reducer;
