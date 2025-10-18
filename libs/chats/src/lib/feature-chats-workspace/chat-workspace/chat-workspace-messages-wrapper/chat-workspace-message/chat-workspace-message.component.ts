import { Component, input, HostBinding, inject, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AvatarCircleComponent } from '@tt/common-ui';
import { Message } from '@tt/data-access';
import { TimePipe } from '@tt/posts';

@Component({
  selector: 'app-chat-workspace-message',
  standalone: true,
  imports: [AvatarCircleComponent, DatePipe, TimePipe],
  templateUrl: './chat-workspace-message.component.html',
  styleUrl: './chat-workspace-message.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatWorkspaceMessageComponent {
  message = input.required<Message>();

  cdr = inject(ChangeDetectorRef)

  @HostBinding('class.is-mine')
  get IsMine() {
    return this.message().isMine;
  }

  constructor() {
    this.cdr.markForCheck();
  }
}
