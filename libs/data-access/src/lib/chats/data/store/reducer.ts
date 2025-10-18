import { Message } from "../interfaces/chats.interface";
import { createFeature, createReducer, on } from '@ngrx/store';
import { chatActions } from './actions';

export interface ChatState {
  messages: Record<number, Message[]>;
}

export const initialStateChats: ChatState = {
  messages: {}
};

export const chatFeature = createFeature({
  name: 'chatFeature',
  reducer: createReducer(
    initialStateChats,
    on(chatActions.messagesLoaded, (state, { chatId, messages }) => ({
      ...state,
      messages: { ...state.messages, [chatId]: messages }
    }))
  )
});
