import { ChatsApi } from 'api/chats';
import { HTTPTransportError } from 'lib/HTTPTransport';
import { store } from 'store';
import { setChats, setSelectedChatId, setUsersInSelectedChat } from 'store/chats/actions';
import { GetFirstParameter } from 'types/common';
import { isGoodApiResponse } from 'utils/api';
import { isNotNil } from 'utils/common';
import { showTooltip } from 'utils/tooltip';
import MessagesController from './message-controller';
import { UserControllerInstance } from './user-controller';

class ChatsController {
  async create(title: string) {
    await ChatsApi.createChat({ title });
    await this.fetchChats();
  }

  async removeChatById(id: number) {
    await ChatsApi.removeChatById({ chatId: id });
    store.dispatch(setSelectedChatId(null));
    this.fetchChats();
  }

  async fetchChats() {
    try {
      const result = await ChatsApi.getChats();
      if (isGoodApiResponse(result)) {
        const chats = result.data;

        chats.map(async (chat) => {
          const tokenResponse = await this.getToken(chat.id);

          if (isGoodApiResponse(tokenResponse)) {
            await MessagesController.connect(chat.id, tokenResponse.data.token);
          }
        });

        store.dispatch(setChats(chats));
      }
    } catch (e) {
      showTooltip({
        message: (e as HTTPTransportError).info ?? 'Ошибка при получении чатов',
        type: 'error',
      });
    }
  }

  async getUsersInChat(chatId: number) {
    return ChatsApi.getUsersInChat(chatId);
  }

  async addUserToChat(data: GetFirstParameter<typeof ChatsApi.addUserToChat>) {
    ChatsApi.addUserToChat(data).then(async () => {
      this.getUsersInChat(data.chatId)
        .then((response) => {
          if (isGoodApiResponse(response)) {
            store.dispatch(setUsersInSelectedChat(response.data));
          }
        })
        .finally(() => this.fetchChats());
    });
  }

  async deleteUserFromChat(data: GetFirstParameter<typeof ChatsApi.removeUserFromChat>) {
    await ChatsApi.removeUserFromChat(data);
    this.getUsersInChat(data.chatId)
      .then((response) => {
        if (isGoodApiResponse(response)) {
          store.dispatch(setUsersInSelectedChat(response.data));
        }
      })
      .finally(() => this.fetchChats());
  }

  async addUserToChatByLogin({ chatId, login }: { chatId: number; login: string }) {
    try {
      const response = await UserControllerInstance.searchUserByLogin(login);

      if (isGoodApiResponse(response)) {
        const user = response.data.find((user) => user.login === login);
        if (user) {
          await this.addUserToChat({ chatId, users: [user.id] });
        }
      }
    } catch (e) {
      showTooltip({
        message: (e as HTTPTransportError).info ?? 'Ошибка при поиске пользователя',
        type: 'error',
      });
    }
  }
  private getToken(chatId: number) {
    return ChatsApi.getChatToken({ chatId });
  }

  selectChat(id: number | null) {
    store.dispatch(setSelectedChatId(id));
    if (isNotNil(id)) {
      this.getUsersInChat(id).then((response) => {
        if (isGoodApiResponse(response)) {
          store.dispatch(setUsersInSelectedChat(response.data));
        }
      });
    } else {
      store.dispatch(setUsersInSelectedChat([]));
    }

    this.fetchChats();
  }
}

export const ChatsControllerInstance = new ChatsController();
