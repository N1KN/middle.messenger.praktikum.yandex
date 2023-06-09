import { UserResponseDTO } from 'api/user/types';

export type CreateChatRequest = {
  title: string;
};

export type CreateChatResponse = {
  id: number;
};

export type ChatIdDTO = {
  chatId: number;
};

export type RemoveOrAddUsersToChatRequest = {
  users: number[];
  chatId: number;
};

export type ChatResponseDTO = {
  id: number;
  title: string;
  avatar?: string | null;
  unread_count: number;
  last_message?: {
    user: Omit<UserResponseDTO, 'id'>;
    time: string;
    content: string;
  } | null;
};

export type MessageDTO = {
  id: number;
  chat_id: number;
  user_id: number;
  type: string;
  time: string;
  is_read: boolean;
  file: null | File;
  content: string;
};

export type ChatUserResponseDTO = UserResponseDTO & {
  role: 'regular' | 'admin';
};
