import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  Renderer2,
  input,
  HostBinding,
  Output,
  EventEmitter,
} from '@angular/core';
import { AvatarCircleComponent } from '../../../common-ui/avatar-circle/avatar-circle.component';
import { ProfileService } from '../../../data/services/profile.service';
import { SvgIconComponent } from '../../../common-ui/svg-icon/svg-icon.component';
import { PostService } from '../../../data/services/post.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-post-input',
  standalone: true,
  imports: [AvatarCircleComponent, CommonModule, SvgIconComponent, FormsModule],
  templateUrl: './post-input.component.html',
  styleUrl: './post-input.component.scss',
})
export class PostInputComponent {
  r2 = inject(Renderer2);
  profile = inject(ProfileService).me;

  isCommentInput = input(false);
  postId = input<number>(0); // ID поста при добавлении комментария

  @Output() submitted = new EventEmitter<string>();

  @HostBinding('class.comment')
  get isComment() {
    return this.isCommentInput();
  }

  postText = '';

  onTextAreaInput(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    this.r2.setStyle(textarea, 'height', 'auto');
    this.r2.setStyle(textarea, 'height', textarea.scrollHeight + 'px');
  }

  onCreatePost() {
    const text = this.postText.trim();
    if (!text) return;
    this.submitted.emit(text);
    this.postText = '';
  }
}
