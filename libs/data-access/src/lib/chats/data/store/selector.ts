import { createSelector } from '@ngrx/store';

import { Message } from '../interfaces/chats.interface';
import { chatFeature } from './reducer';

export const selectMessagesByChatId = (chatId: number) =>
  createSelector(chatFeature.selectMessages, (messages: Record<number, Message[]>) => messages[chatId] ?? []);
