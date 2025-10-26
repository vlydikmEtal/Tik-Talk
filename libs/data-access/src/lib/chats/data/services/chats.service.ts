import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chat, LastMessageRes, Message } from '../interfaces/chats.interface';
import { map, Observable } from 'rxjs';
import { ProfileService } from '../../../profile/data';
import { ChatWsService } from '../interfaces/chat-ws-service.interface';
import { ChatWsMessage } from '../interfaces/chat-ws-message.interface';
import { isErrorMessage, isNewMessage, isUnreadMessage } from '../interfaces/type-guards';
import { ChatWsRxjsService } from './chat-ws-rxjs.service';
import { AuthService } from '../../../auth/data';


@Injectable({
  providedIn: 'root'
})
export class ChatService {
  http = inject(HttpClient);
  #authService = inject(AuthService);
  me = inject(ProfileService).me;

  wsAdapter: ChatWsService = new ChatWsRxjsService();

  activeChatMessages = signal<Message[]>([]);
  unreadMessagesCount = signal(0);
  groupedActiveMessages = signal<[string, Message[]][]>([]);

  baseApiUrl = '/yt-course/';
  chatsUrl = `${this.baseApiUrl}chat/`;
  messageUrl = `${this.baseApiUrl}message/`;


  connectWs() {
    return this.wsAdapter.connect({
      url: `${this.baseApiUrl}chat/ws`,
      token: this.#authService.token ?? '',
      // * обновить токен чатов
      handleMessage: this.handleWsMessage
    }) as Observable<ChatWsMessage>;
  }

  // TODO Замыкания
  handleWsMessage = (message: ChatWsMessage) => {
    if (!('action' in message)) return;

    if (isUnreadMessage(message)) {
      this.unreadMessagesCount.set(message.data.count);
    }

    if (isErrorMessage(message)) {
      console.log('Токен протух — реконнект инициирует Sidebar');
      return;
    }

    if (isNewMessage(message)) {
      const myProfile = this.me()!
      const companion = this.activeCompanion;

      if (!myProfile || !companion) return;

      const newMessage: Message = {
        id: message.data.id,
        userFromId: message.data.author,
        personalChatId: String(message.data.chat_id),
        text: message.data.message,
        createdAt: message.data.created_at,
        isRead: false,
        isMine: message.data.author === myProfile.id,
        user: message.data.author === myProfile.id
          ? myProfile
          : companion ?? {
          id: message.data.author,
          username: 'Собеседник',
          avatarUrl: null,
          firstName: '',
          lastName: '',
          subscribersAmount: 0,
          isActive: false,
          stack: [],
          city: '',
          description: '',
        }
      };

      const exists = this.activeChatMessages().some(m => m.id === newMessage.id);
      if (exists) return;

      const allMessages = [...this.activeChatMessages(), newMessage];
      this.activeChatMessages.set(allMessages);
      this.groupedActiveMessages.set(this.groupMessages(allMessages));
    }

  };

  createChat(userId: number) {
    return this.http.post<Chat>(`${this.chatsUrl}${userId}`, {});
  }

  getMyChats() {
    return this.http.get<LastMessageRes[]>(`${this.chatsUrl}get_my_chats/`);
  }

  activeCompanion?: { id: number; username: string; avatar?: string | null };

  getChatById(chatId: number) {
    return this.http.get<Chat>(`${this.chatsUrl}${chatId}`).pipe(
      map((chat) => {
        const patchedMessages = chat.messages.map((message) => ({
          ...message,
          user:
            chat.userFirst.id === message.userFromId
              ? chat.userFirst
              : chat.userSecond,
          isMine: message.userFromId === this.me()!.id,
          createdAt: message.createdAt
        }));

        const companion =
          chat.userFirst.id === this.me()!.id
            ? chat.userSecond
            : chat.userFirst;

        this.activeCompanion = companion;

        this.activeChatMessages.set(patchedMessages);
        this.groupedActiveMessages.set(this.groupMessages(patchedMessages));

        return {
          ...chat,
          companion,
          messages: patchedMessages
        };
      })
    );
  }



  sendMessage<Message>(chatId: number, message: string) {
    return this.http.post(
      `${this.messageUrl}send/${chatId}`,
      {},
      {
        params: {
          message
        }
      }
    );
  }

  private groupMessages(messages: Message[]): [string, Message[]][] {
    const grouped = new Map<string, Message[]>();
    for (const msg of messages) {
      const date = this.formatDate(msg.createdAt);
      if (!grouped.has(date)) grouped.set(date, []);
      grouped.get(date)!.push(msg);
    }
    return Array.from(grouped.entries());
  }

  private formatDate(dateStr: string) {
    const date = new Date(dateStr);
    const today = new Date();
    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
    return isToday ? 'Сегодня' : date.toLocaleDateString();
  }


}
