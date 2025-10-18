import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { ChatsBtnComponent } from '../chats-btn/chats-btn.component';
import { AsyncPipe } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { map, switchMap, startWith } from 'rxjs';
import { ChatService } from '@tt/data-access';


@Component({
  selector: 'app-chats-list',
  standalone: true,
  imports: [
    ChatsBtnComponent,
    AsyncPipe,
    RouterLink,
    RouterLinkActive,
    ReactiveFormsModule,
  ],
  templateUrl: './chats-list.component.html',
  styleUrl: './chats-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatsListComponent {
  chatsService = inject(ChatService);

  cdr = inject(ChangeDetectorRef)

  filterChatsControl = new FormControl('');

  chats$ = this.chatsService.getMyChats().pipe(
    switchMap((chats) => {
      return this.filterChatsControl.valueChanges.pipe(
        startWith(''),
        map((inputValue) => {
          return chats.filter((chat) => {
            return `${chat.userFrom.lastName} ${chat.userFrom.firstName}`
              .toLowerCase()
              .includes((inputValue ?? '').toLowerCase());
          });
        })
      );
    })
  );

  constructor() {
    this.cdr.markForCheck()
  }
}
