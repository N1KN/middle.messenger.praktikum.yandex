export type UserResponseDTO = {
  first_name: string;
  second_name: string;
  avatar: string;
  email: string;
  login: string;
  phone: string;
};

export type ChatResponseDTO = {
  id: number;
  title: string;
  avatar?: string | null;
  unread_count: number;
  last_message?: {
    user: UserResponseDTO;
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
