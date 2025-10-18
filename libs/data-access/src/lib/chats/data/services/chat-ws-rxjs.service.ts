import { ChatConnectionWsParams, ChatWsService } from '../interfaces/chat-ws-service.interface';
import { WebSocketSubject } from 'rxjs/internal/observable/dom/WebSocketSubject';
import { ChatWsMessage } from '../interfaces/chat-ws-message.interface';
import { webSocket } from 'rxjs/webSocket';
import { finalize, Observable, tap } from 'rxjs';

export class ChatWsRxjsService implements ChatWsService {
  #socket: WebSocketSubject<ChatWsMessage> | null = null;

  connect(params: ChatConnectionWsParams): Observable<ChatWsMessage> {
    if (!this.#socket) {
      this.#socket = webSocket({
        url: params.url,
        protocol: [params.token]
      });
    }

    return this.#socket.asObservable()
      .pipe(
        tap(message => params.handleMessage(message)),
        finalize(() => console.log('А что вы тут делаете?'))
    )
  }

  disconnect(): void {
    this.#socket?.complete()
  }

  sendMessage(text: string, chatId: number): void {
    this.#socket?.next({
      text,
      chat_id: chatId,
    })
  }
}
