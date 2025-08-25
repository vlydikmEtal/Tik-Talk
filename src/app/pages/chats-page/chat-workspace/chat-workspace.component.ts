import { AsyncPipe } from '@angular/common';
import { switchMap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Component, inject } from '@angular/core';
import { ChatWorkspaceHeaderComponent } from "./chat-workspace-header/chat-workspace-header.component";
import { ChatWorkspaceMessagesWrapperComponent } from "./chat-workspace-messages-wrapper/chat-workspace-messages-wrapper.component";
import { MessageInputComponent } from "../../../common-ui/message-input/message-input.component";
import { ChatService } from '../../../data/services/chats.service';

@Component({
  selector: 'app-chat-workspace',
  standalone: true,
  imports: [ChatWorkspaceHeaderComponent, ChatWorkspaceMessagesWrapperComponent, AsyncPipe],
  templateUrl: './chat-workspace.component.html',
  styleUrl: './chat-workspace.component.scss'
})
export class ChatWorkspaceComponent {
  route = inject(ActivatedRoute)
  chatsService = inject(ChatService)

  activeChat$ = this.route.params
    .pipe(
      switchMap(({id}) => this.chatsService.getChatById(id))
    )
}
