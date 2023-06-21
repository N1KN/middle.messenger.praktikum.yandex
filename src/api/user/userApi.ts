import { httpTransport } from 'lib/http-transport';
import { FindUserRequest, UserPasswordRequest, UserResponseDTO, UserUpdateRequest } from './types';

export class UserApi {
  static readonly basePath = '/user';
  static async changeAvatar(avatar: FormData) {
    return httpTransport.put(`${this.basePath}/profile/avatar`, avatar, {});
  }

  static async changeUserInfo(userInfo: UserUpdateRequest) {
    return httpTransport.put<UserResponseDTO>(`${this.basePath}/profile`, userInfo);
  }

  static async changeUserPassword(userPassword: UserPasswordRequest) {
    return httpTransport.put(`${this.basePath}/password`, userPassword);
  }

  static async searchUserByLogin(data: FindUserRequest) {
    return httpTransport.post<UserResponseDTO[]>(`${this.basePath}/search`, data);
  }
}
