import { ChangeDetectorRef, Component, inject, input } from '@angular/core';
import { AvatarCircleComponent } from '@tt/common-ui';
import { LastMessageRes } from '@tt/data-access';
import { TimePipe } from '@tt/posts';
import { DatePipe, NgIf, SlicePipe } from '@angular/common';



@Component({
  selector: 'button[chats]',
  standalone: true,
  imports: [AvatarCircleComponent, TimePipe, DatePipe, SlicePipe, NgIf],
  templateUrl: './chats-btn.component.html',
  styleUrl: './chats-btn.component.scss',
})
export class ChatsBtnComponent {
  chat = input<LastMessageRes>();

  cdr = inject(ChangeDetectorRef)

  constructor() {
    this.cdr.markForCheck()
  }
}
