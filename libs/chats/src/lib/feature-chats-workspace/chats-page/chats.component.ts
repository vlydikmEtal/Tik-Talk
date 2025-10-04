import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ChatsListComponent } from '../chats-list/chats-list.component';

@Component({
  selector: 'app-chats',
  standalone: true,
  imports: [RouterModule, ChatsListComponent],
  templateUrl: './chats.component.html',
  styleUrl: './chats.component.scss',
})
export class ChatsPageComponent {}
