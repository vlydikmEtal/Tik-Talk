import { createActionGroup, props } from '@ngrx/store';
import { Message } from '../interfaces/chats.interface';

export const chatActions = createActionGroup({
  source: 'chats',
  events: {
    'get messages': props<{ chatId: number }>(),
    'messages loaded': props<{ chatId: number; messages: Message[] }>(),
    'send message': props<{ chatId: number; text: string }>()
  }
});
