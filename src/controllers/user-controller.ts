import { RouteNames } from 'constants';
import { UserApi } from 'api/user';
import { GetFirstParameter } from 'types/common';
import { isBadResponse } from 'utils/api';
import { RouterInstance } from 'utils/router';
import { showTooltip } from 'utils/tooltip';
import { AuthControllerInstance } from './auth-controller';

export class UserController {
  async updateUser(data: GetFirstParameter<typeof UserApi.changeUserInfo>) {
    try {
      await UserApi.changeUserInfo(data);
      await AuthControllerInstance.getUserInfo();

      RouterInstance.goByRouteName(RouteNames.ACCOUNT);
    } catch (e: any) {
      console.error(e);
    }
  }

  async updatePassword(data: GetFirstParameter<typeof UserApi.changeUserPassword>) {
    try {
      await UserApi.changeUserPassword(data);
      RouterInstance.goByRouteName(RouteNames.ACCOUNT);
    } catch (e: any) {
      if (isBadResponse(e)) {
        showTooltip({
          message: e.info ?? 'Ошибка при обновлении пароля',
          type: 'error',
        });
      }
    }
  }

  async updateAvatar(data: FormData) {
    try {
      await UserApi.changeAvatar(data);
      await AuthControllerInstance.getUserInfo();
    } catch (e: any) {
      console.error(e.message);
    }
  }

  async searchUserByLogin(login: string) {
    return UserApi.searchUserByLogin({ login });
  }
}

export const UserControllerInstance = new UserController();
