import { ChatResponseDTO, ChatUserResponseDTO } from 'api/chats/types';
import { createAction } from 'lib/state-manager';
import { MessagesForChatById } from './types';

export const setSelectedChatId = createAction<number | null, 'SET_SELECTED_CHAT_ID'>('SET_SELECTED_CHAT_ID');
setSelectedChatId.type;
export const setChats = createAction<ChatResponseDTO[], 'SET_CHATS'>('SET_CHATS');
export const setMessagesForChatById = createAction<MessagesForChatById, 'SET_MESSAGES_FOR_CHAT_BY_ID'>(
  'SET_MESSAGES_FOR_CHAT_BY_ID',
);

export const addMessagesForChatById = createAction<MessagesForChatById, 'ADD_MESSAGES_FOR_CHAT_BY_ID'>(
  'ADD_MESSAGES_FOR_CHAT_BY_ID',
);

export const removeAllMessagesForChatById = createAction<number, 'REMOVE_ALL_MESSAGES_FOR_CHAT_BY_ID'>(
  'REMOVE_ALL_MESSAGES_FOR_CHAT_BY_ID',
);

export const setUsersInSelectedChat = createAction<ChatUserResponseDTO[], 'SET_USERS_IN_SELECTED_CHAT'>(
  'SET_USERS_IN_SELECTED_CHAT',
);
