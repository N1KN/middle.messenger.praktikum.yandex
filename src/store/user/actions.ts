import { UserResponseDTO } from 'api/user/types';
import { createAction } from 'lib/state-manager';

export const setUser = createAction<UserResponseDTO, 'SET_USER'>('SET_USER');
