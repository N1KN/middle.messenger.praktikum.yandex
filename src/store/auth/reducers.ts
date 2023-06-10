import { createReducer } from 'lib/state-manager';
import { setIsLoggedIn, setAuthError, setAuthChecked } from './actions';
import { AuthState } from './types';

const initialState: AuthState = {
  authError: null,
  isLoggedIn: false,
  authChecked: false,
};

const reducer = createReducer<AuthState>(initialState, {
  [setAuthError.type]: (state, action: ReturnType<typeof setAuthError>) => {
    return { ...state, authError: action.payload };
  },
  [setIsLoggedIn.type]: (state, action: ReturnType<typeof setIsLoggedIn>) => {
    return { ...state, isLoggedIn: action.payload };
  },
  [setAuthChecked.type]: (state, action: ReturnType<typeof setAuthChecked>) => {
    return { ...state, authChecked: action.payload };
  },
});

export const authReducer = reducer;
