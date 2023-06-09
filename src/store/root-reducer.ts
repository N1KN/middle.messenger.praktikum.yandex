import { combineReducers } from 'lib/state-manager';
import { authReducer } from './auth/reducers';
import { chatReducer } from './chats/reducers';
import { RootDucks } from './types';
import { userReducer } from './user/reducers';

export const rootReducer = combineReducers({
  [RootDucks.AUTH]: authReducer,
  [RootDucks.CHATS]: chatReducer,
  [RootDucks.USER]: userReducer,
});
