import { ChatResponseDTO, ChatUserResponseDTO, MessageDTO } from 'api/chats/types';

export type ChatState = {
  chats: ChatResponseDTO[];
  messages: Record<number, MessageDTO[]>;
  selectedChatId?: number | null;
  usersInSelectedChat: ChatUserResponseDTO[];
};

export type MessagesForChatById = {
  id: number;
  messages: MessageDTO[];
};
