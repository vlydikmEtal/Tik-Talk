import { Component, input } from '@angular/core';
import { AvatarCircleComponent } from '@tt/common-ui';
import { LastMessageRes, Message } from '@tt/data-access';
import { TimePipe } from '@tt/posts';
import { DatePipe } from '@angular/common';



@Component({
  selector: 'button[chats]',
  standalone: true,
  imports: [AvatarCircleComponent, TimePipe, DatePipe],
  templateUrl: './chats-btn.component.html',
  styleUrl: './chats-btn.component.scss',
})
export class ChatsBtnComponent {

  chat = input<LastMessageRes>();
}
