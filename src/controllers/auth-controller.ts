import { RouteNames } from 'constants';
import { AuthApi } from 'api/auth';
import { setAuthChecked, setIsLoggedIn } from 'store/auth/actions';
import { store } from 'store/store';
import { setUser } from 'store/user/actions';
import { GetFirstParameter } from 'types/common';
import { isGoodApiResponse } from 'utils/api';
import { RouterInstance } from 'utils/router';

class AuthController {
  async signIn(data: GetFirstParameter<typeof AuthApi.signIn>) {
    try {
      const result = await AuthApi.signIn(data);
      if (isGoodApiResponse(result)) {
        await this.getUserInfo();

        RouterInstance.goByRouteName(RouteNames.CHATS);
      }
    } catch (e: any) {
      console.error(e);
    }
  }

  async signUp(data: GetFirstParameter<typeof AuthApi.signUp>) {
    try {
      await AuthApi.signUp(data);
      await this.getUserInfo();

      RouterInstance.goByRouteName(RouteNames.CHATS);
    } catch (e: any) {
      console.error(e.message);
    }
  }

  async getUserInfo() {
    try {
      const result = await AuthApi.getUserInfo();

      if (isGoodApiResponse(result)) {
        store.dispatch(setUser(result.data));
        store.dispatch(setIsLoggedIn(true));
      }
    } catch (e: any) {
      store.dispatch(setIsLoggedIn(false));
    } finally {
      if (!store.getState().auth.authChecked) {
        store.dispatch(setAuthChecked(true));
      }
    }
  }

  async logout() {
    try {
      await AuthApi.logout();

      RouterInstance.goByRouteName(RouteNames.ROOT_PAGE);
    } catch (e: any) {
      console.error(e.message);
    }
  }
}

export const AuthControllerInstance = new AuthController();
