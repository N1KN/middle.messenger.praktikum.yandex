import { createAction } from 'lib/state-manager';

export const setAuthError = createAction<string | null, 'SET_AUTH_ERROR'>('SET_AUTH_ERROR');
export const setIsLoggedIn = createAction<boolean, 'SET_IS_LOGGED_IN'>('SET_IS_LOGGED_IN');
export const setAuthChecked = createAction<boolean, 'SET_AUTH_CHECKED'>('SET_AUTH_CHECKED');
