import { httpTransport } from 'lib/HTTPTransport';
import {
  ChatIdDTO,
  ChatResponseDTO,
  CreateChatRequest,
  CreateChatResponse,
  RemoveOrAddUsersToChatRequest,
} from './types';

export class User {
  static readonly basePath = '/chats';

  static async getChats(title?: string) {
    return httpTransport.get<ChatResponseDTO[]>(`${this.basePath}`, { title });
  }

  static async createChat(data: CreateChatRequest) {
    return httpTransport.post<CreateChatResponse>(`${this.basePath}`, data);
  }

  static async removeChatById(data: ChatIdDTO) {
    return httpTransport.delete(`${this.basePath}`, data);
  }

  static async addUserToChat(data: RemoveOrAddUsersToChatRequest) {
    return httpTransport.put(`${this.basePath}/users`, data);
  }

  static async removeUserFromChat({ ...rest }: RemoveOrAddUsersToChatRequest) {
    return httpTransport.delete(`${this.basePath}/users`, { ...rest });
  }

  static async getChatToken({ chatId }: ChatIdDTO) {
    return httpTransport.post(`token/${chatId}`, {});
  }

  static async getUserForChat({ chatId }: ChatIdDTO) {
    return httpTransport.get(`${this.basePath}/${chatId}/users`);
  }
}
