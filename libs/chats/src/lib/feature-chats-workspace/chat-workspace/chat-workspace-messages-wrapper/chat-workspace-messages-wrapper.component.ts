import {
  Component,
  ElementRef,
  ViewChild,
  inject,
  input,
  OnDestroy,
  Renderer2,
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import {
  fromEvent,
  Subscription
} from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ChatWorkspaceMessageComponent } from './chat-workspace-message/chat-workspace-message.component';
import { MessageInputComponent } from '../../../ui';
import { Chat, ChatService, Message } from '@tt/data-access';

@Component({
  selector: 'app-chat-workspace-messages-wrapper',
  standalone: true,
  imports: [ChatWorkspaceMessageComponent, MessageInputComponent],
  templateUrl: './chat-workspace-messages-wrapper.component.html',
  styleUrl: './chat-workspace-messages-wrapper.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatWorkspaceMessagesWrapperComponent implements AfterViewInit, OnDestroy {
  chatsService = inject(ChatService);
  chat = input.required<Chat>();
  messages = this.chatsService.groupedActiveMessages;

  cdr = inject(ChangeDetectorRef)

  #resizeSub?: Subscription;
  @ViewChild('messagesWrapper') messagesWrapper!: ElementRef<HTMLDivElement>;
  r2 = inject(Renderer2);
  hostElement = inject(ElementRef);

  ngAfterViewInit() {
    this.resizeFeed();
    this.#resizeSub = fromEvent(window, 'resize')
      .pipe(debounceTime(200))
      .subscribe(() => this.resizeFeed());
    this.scrollToBottom();
  }

  ngOnDestroy() {
    this.#resizeSub?.unsubscribe();
  }

  async onSendMessage(messageText: string) {
    // Отправка на сервер через WS
    this.chatsService.wsAdapter.sendMessage(messageText, this.chat().id);
    // Не добавляем вручную — WS вернёт сообщение обратно
    this.scrollToBottom();
  }

  private resizeFeed() {
    const { top } = this.hostElement.nativeElement.getBoundingClientRect();
    const height = window.innerHeight - top - 10;
    this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`);
  }

  private scrollToBottom() {
    if (!this.messagesWrapper) return;
    setTimeout(() => {
      this.messagesWrapper.nativeElement.scrollTop =
        this.messagesWrapper.nativeElement.scrollHeight;
    });
  }

  constructor() {
    this.cdr.markForCheck();
  }
}

