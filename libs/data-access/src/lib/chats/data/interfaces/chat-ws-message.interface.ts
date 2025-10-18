export interface ChatWsMessageBase {
  status: 'success' | 'error'
}

export interface ChatWsUnreadMessage extends ChatWsMessageBase {
  action: 'unread'
  data: {
    count: number;
  }
}

export interface ChatWsNewMessage extends ChatWsMessageBase {
  action: 'message'
  data: {
    id: number
    message: string
    chat_id: string
    created_at: string
    author: number
  }
}

export interface ChatWsErrorMessage extends ChatWsMessageBase {
  message: string
}

export interface ChatWsSendMessage  {
  text: string
  chat_id: number
}

export type ChatWsMessage = ChatWsSendMessage | ChatWsNewMessage | ChatWsMessageBase | ChatWsErrorMessage | ChatWsUnreadMessage;
