import { httpTransport } from '../../lib/HTTPTransport';
import { SignInRequestDTO, SignUpRequestDTO, SignUpResponseDTO } from './types';

export class Auth {
  static readonly basePath = '/auth';
  static async signIn(data: SignInRequestDTO) {
    return httpTransport.post(`${this.basePath}/signin`, data);
  }

  static async signUp(data: SignUpRequestDTO) {
    return httpTransport.post<SignUpResponseDTO>(`${this.basePath}/signup`, data);
  }

  static async logout() {
    return httpTransport.post(`${this.basePath}/logout`, {});
  }

  static async getUserInfo() {
    return httpTransport.get(`${this.basePath}/user`);
  }
}
