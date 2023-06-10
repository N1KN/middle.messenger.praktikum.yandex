import { store } from './store';

export enum RootDucks {
  USER = 'user',
  AUTH = 'auth',
  CHATS = 'chats',
}

export type RootState = ReturnType<typeof store.getState>;
