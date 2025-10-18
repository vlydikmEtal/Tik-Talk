import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ChatService } from '../services/chats.service';
import { chatActions } from './actions';
import { map, switchMap } from 'rxjs';


@Injectable()
export class ChatEffects {
  actions$ = inject(Actions);
  chatService = inject(ChatService);

  getMessages = createEffect(() =>
    this.actions$.pipe(
      ofType(chatActions.getMessages),
      switchMap(({ chatId }) =>
        this.chatService.getChatById(chatId).pipe(
          map(chat => chatActions.messagesLoaded({ chatId: chat.id, messages: chat.messages }))
        )
      )
    )
  );

  sendMessage = createEffect(() =>
    this.actions$.pipe(
      ofType(chatActions.sendMessage),
      switchMap(({ chatId, text }) =>
        this.chatService.sendMessage(chatId, text).pipe(
          switchMap(() => this.chatService.getChatById(chatId)), // после отправки обновляем сообщения
          map(chat => chatActions.messagesLoaded({ chatId: chat.id, messages: chat.messages }))
        )
      )
    )
  );
}
