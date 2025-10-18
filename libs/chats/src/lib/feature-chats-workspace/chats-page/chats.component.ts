import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ChatsListComponent } from '../chats-list/chats-list.component';
import { ChatService } from '@tt/data-access';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-chats',
  standalone: true,
  imports: [RouterModule, ChatsListComponent],
  templateUrl: './chats.component.html',
  styleUrl: './chats.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatsPageComponent {
  #chatService = inject(ChatService);

  cdr = inject(ChangeDetectorRef);

  constructor() {
    this.cdr.markForCheck();

    this.#chatService.connectWs()
      .pipe(takeUntilDestroyed())
      .subscribe();
  }

}
