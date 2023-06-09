import { createReducer } from 'lib/state-manager';
import { deepAssign } from 'utils/common';
import {
  setSelectedChatId,
  setChats,
  setMessagesForChatById,
  addMessagesForChatById,
  removeAllMessagesForChatById,
  setUsersInSelectedChat,
} from './actions';
import { ChatState } from './types';

const initialState: ChatState = {
  selectedChatId: null,
  chats: [],
  messages: {},
  usersInSelectedChat: [],
};
setSelectedChatId.type;

const reducer = createReducer<ChatState>(initialState, {
  [setSelectedChatId.type]: (state, action: ReturnType<typeof setSelectedChatId>) => {
    return { ...state, selectedChatId: action.payload };
  },
  [setChats.type]: (state, action: ReturnType<typeof setChats>): ChatState => {
    return { ...state, chats: action.payload };
  },
  [setMessagesForChatById.type]: (state, action: ReturnType<typeof setMessagesForChatById>): ChatState => {
    const messagesMapToChat = {
      [action.payload.id]: action.payload.messages,
    };

    return {
      ...state,
      messages: {
        ...state.messages,
        ...messagesMapToChat,
      },
    };
  },
  [addMessagesForChatById.type]: (state, action: ReturnType<typeof addMessagesForChatById>): ChatState => {
    const messagesMapToChat = {
      [action.payload.id]: action.payload.messages,
    };

    const newMessages = deepAssign(state.messages, messagesMapToChat);

    return {
      ...state,
      messages: newMessages,
    };
  },
  [removeAllMessagesForChatById.type]: (state, action: ReturnType<typeof removeAllMessagesForChatById>): ChatState => {
    const newMessagesState = { ...state.messages };
    newMessagesState[action.payload] = [];
    delete newMessagesState[action.payload];

    return { ...state, messages: { ...newMessagesState } };
  },
  [setUsersInSelectedChat.type]: (state, action: ReturnType<typeof setUsersInSelectedChat>) => {
    return { ...state, usersInSelectedChat: action.payload };
  },
});

export const chatReducer = reducer;
