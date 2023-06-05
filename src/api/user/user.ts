import { httpTransport } from 'lib/HTTPTransport';
import { FindUserRequest, UserPasswordRequest, UserResponseDTO, UserUpdateRequest } from './types';

export class User {
  static readonly basePath = '/user';
  static async changeAvatar(avatar: FormData) {
    return httpTransport.put(`${this.basePath}/profile/avatar`, avatar, {});
  }

  static async changeUserInfo(userInfo: UserUpdateRequest) {
    return httpTransport.put<UserResponseDTO>('/profile', userInfo);
  }

  static async changeUserPassword(userPassword: UserPasswordRequest) {
    return httpTransport.put('/password', userPassword);
  }

  static async searchUserByLogin(data: FindUserRequest) {
    return httpTransport.post('/search', data);
  }
}
