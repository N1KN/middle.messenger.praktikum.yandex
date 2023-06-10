import { showTooltip } from 'utils/tooltip';
import { EventBus } from './event-bus';

export enum WebSocketTransportEvents {
  Connected = 'connected',
  Error = 'error',
  Message = 'message',
  Close = 'close',
}

export class WebSocketTransport extends EventBus {
  private socket: WebSocket | null = null;
  private readonly url: string;
  private pingInterval: any = 0;

  constructor(url: string) {
    super();

    this.url = url;
  }

  public send(data: unknown) {
    if (!this.socket) {
      throw new Error('Socket is not connected');
    }

    this.socket.send(JSON.stringify(data));
  }

  public connect(): Promise<void> {
    this.socket = new WebSocket(this.url);

    this.subscribe(this.socket);

    this.setupPing();

    return new Promise((resolve) => {
      this.on(WebSocketTransportEvents.Connected, () => {
        resolve();
      });
    });
  }

  public close() {
    clearInterval(this.pingInterval);

    this.socket?.close();
  }

  private setupPing() {
    this.pingInterval = setInterval(() => {
      this.send({ type: 'ping' });
    }, 5000);

    this.on(WebSocketTransportEvents.Close, () => {
      clearInterval(this.pingInterval);

      this.pingInterval = 0;
    });
  }

  private subscribe(socket: WebSocket) {
    socket.addEventListener('open', () => {
      this.emit(WebSocketTransportEvents.Connected);
    });
    socket.addEventListener('close', () => {
      this.emit(WebSocketTransportEvents.Close);
    });

    socket.addEventListener('error', (e) => {
      this.emit(WebSocketTransportEvents.Error, e);
    });

    socket.addEventListener('message', (message) => {
      try {
        const data = JSON.parse(message.data);

        if (data?.type === 'pong') {
          return;
        }

        this.emit(WebSocketTransportEvents.Message, data);
      } catch (e) {
        showTooltip({
          message: (e as SyntaxError).toString(),
          type: 'error',
        });
      }
    });
  }
}
