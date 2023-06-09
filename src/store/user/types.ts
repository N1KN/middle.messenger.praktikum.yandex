import { UserResponseDTO } from 'api/user/types';

export type UserState = {
  userInfo: UserResponseDTO | null;
  token: string | null;
};
