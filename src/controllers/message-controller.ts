import { APP_URLS } from 'constants';
import { MessageDTO } from 'api/chats/types';
import { WebSocketTransportEvents, WebSocketTransport } from 'lib/web-socket-transport';
import { store } from 'store';
import { addMessagesForChatById } from 'store/chats/actions';
import { debounce } from 'utils/common';
import { ChatsControllerInstance } from './chat-controller';

export class MessagesController {
  private transports: Map<number, WebSocketTransport> = new Map();
  private debouncedFetchChats: (() => void) | null = null;

  checkIsConnected(id: number): boolean {
    return this.transports.has(id);
  }

  async connect(id: number, token: string) {
    if (this.transports.has(id)) {
      return;
    }

    const userId = store.getState().user.userInfo?.id;

    const transport = new WebSocketTransport(`${APP_URLS.SOCKET}/${userId}/${id}/${token}`);

    this.transports.set(id, transport);

    await transport.connect();

    this.subscribe(transport, id);
    this.fetchOldMessages(id);
  }

  async sendMessage(id: number, message: string) {
    const transport = this.transports.get(id);

    if (!transport) {
      throw new Error(`Chat ${id} is not connected`);
    }

    transport!.send({
      type: 'message',
      content: message,
    });
  }

  fetchOldMessages(id: number) {
    const transport = this.transports.get(id);

    if (!transport) {
      throw new Error(`Chat ${id} is not connected`);
    }

    transport.send({ type: 'get old', content: '0' });
  }

  closeAll() {
    Object.values(this.transports).forEach((transport) => transport.close());
  }

  private onMessage(id: number, messages: MessageDTO | MessageDTO[]) {
    let messagesToAdd: MessageDTO[] = [];

    if (Array.isArray(messages)) {
      messagesToAdd = messages.reverse();
    } else {
      messagesToAdd.push(messages);
    }

    store.dispatch(addMessagesForChatById({ id, messages: messagesToAdd }));

    if (!this.debouncedFetchChats) {
      this.debouncedFetchChats = debounce(ChatsControllerInstance.fetchChats.bind(ChatsControllerInstance), 1000);
    }

    this.debouncedFetchChats();
  }

  private onClose(id: number) {
    this.transports.delete(id);
  }

  private subscribe(transport: WebSocketTransport, id: number) {
    transport.on(WebSocketTransportEvents.Message, (message) => this.onMessage(id, message));
    transport.on(WebSocketTransportEvents.Close, () => this.onClose(id));
  }
}

export const MessagesControllerInstance = new MessagesController();
