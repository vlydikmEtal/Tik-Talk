import { firstValueFrom, fromEvent, Subscription, switchMap, timer } from 'rxjs';
import { Component, ElementRef, ViewChild, inject, input, OnDestroy, Renderer2, AfterViewInit } from '@angular/core';
import { ChatWorkspaceMessageComponent } from './chat-workspace-message/chat-workspace-message.component';
import { MessageInputComponent } from '../../../ui';
import { Chat, ChatService } from '@tt/data-access';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-chat-workspace-messages-wrapper',
  standalone: true,
  imports: [ChatWorkspaceMessageComponent, MessageInputComponent],
  templateUrl: './chat-workspace-messages-wrapper.component.html',
  styleUrl: './chat-workspace-messages-wrapper.component.scss'
})
export class ChatWorkspaceMessagesWrapperComponent implements AfterViewInit, OnDestroy {
  chatsService = inject(ChatService);
  chat = input.required<Chat>();
  messages = this.chatsService.activeChatMessages;
  timerSub?: Subscription;
  r2 = inject(Renderer2);
  hostElement = inject(ElementRef);
  #resizeSub?: Subscription;

  @ViewChild('messagesWrapper') messagesWrapper!: ElementRef<HTMLDivElement>;

  constructor() {
    this.startPolling();
  }

  ngOnDestroy() {
    this.timerSub?.unsubscribe();
    this.#resizeSub?.unsubscribe();
  }

  startPolling() {
    this.timerSub = timer(0, 5000)
      .pipe(
        switchMap(() => this.chatsService.getChatById(this.chat().id))
      )
      .subscribe(() => this.scrollToBottom()); // <-- скроллим при новых данных
  }

  async onSendMessage(messageText: string) {
    await firstValueFrom(
      this.chatsService.sendMessage(this.chat().id, messageText)
    );

    await firstValueFrom(this.chatsService.getChatById(this.chat().id));
    this.scrollToBottom(); // <-- скроллим после отправки
  }

  ngAfterViewInit() {
    this.resizeFeed();
    this.#resizeSub = fromEvent(window, 'resize')
      .pipe(debounceTime(200))
      .subscribe(() => this.resizeFeed());

    this.scrollToBottom(); // <-- скроллим при первом рендере
  }

  resizeFeed() {
    const { top } = this.hostElement.nativeElement.getBoundingClientRect();
    const height = window.innerHeight - top - 10;
    this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`);
  }

  private scrollToBottom() {
    if (this.messagesWrapper) {
      setTimeout(() => {
        this.messagesWrapper.nativeElement.scrollTop =
          this.messagesWrapper.nativeElement.scrollHeight;
      });
    }
  }
}
