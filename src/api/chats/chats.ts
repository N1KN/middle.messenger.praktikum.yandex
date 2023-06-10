import { httpTransport } from 'lib/HTTPTransport';
import {
  ChatIdDTO,
  ChatResponseDTO,
  ChatUserResponseDTO,
  CreateChatRequest,
  CreateChatResponse,
  RemoveOrAddUsersToChatRequest,
} from './types';

export class ChatsApi {
  static readonly basePath = '/chats';

  static async getChats() {
    return httpTransport.get<ChatResponseDTO[]>(`${this.basePath}`, {});
  }

  static async createChat(data: CreateChatRequest) {
    return httpTransport.post<CreateChatResponse>(`${this.basePath}`, data);
  }

  static async removeChatById(data: ChatIdDTO) {
    return httpTransport.delete(`${this.basePath}`, data);
  }

  static async getUsersInChat(chatId: number) {
    return httpTransport.get<ChatUserResponseDTO[]>(`${this.basePath}/${chatId}/users`, {});
  }

  static async addUserToChat(data: RemoveOrAddUsersToChatRequest) {
    return httpTransport.put(`${this.basePath}/users`, data);
  }

  static async removeUserFromChat({ ...rest }: RemoveOrAddUsersToChatRequest) {
    return httpTransport.delete(`${this.basePath}/users`, { ...rest });
  }

  static async getChatToken({ chatId }: ChatIdDTO) {
    return httpTransport.post<{ token: string }>(`${this.basePath}/token/${chatId}`, {});
  }
}
