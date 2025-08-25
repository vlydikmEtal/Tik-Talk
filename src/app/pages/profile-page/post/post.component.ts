import { Component, inject, input, OnInit, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AvatarCircleComponent } from '../../../common-ui/avatar-circle/avatar-circle.component';
import { SvgIconComponent } from '../../../common-ui/svg-icon/svg-icon.component';
import { CommentCreateDto, Post, PostComment } from '../../../data/interfaces/post.interfaces';
import { PostInputComponent } from '../post-input/post-input.component';
import { PostService } from './../../../data/services/post.service';
import { CommentComponent } from './comment/comment.component';
import { TimePipe } from '../../../helpers/pipes/time.pipe';
import { ProfileService } from '../../../data/services/profile.service';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
    AvatarCircleComponent,
    TimePipe,
    SvgIconComponent,
    PostInputComponent,
    CommentComponent,
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
})
export class PostComponent implements OnInit {
  post = input<Post>();
  comments = signal<PostComment[]>([]);

  postService = inject(PostService);
  profileService = inject(ProfileService).me;

  async ngOnInit() {
    this.comments.set(this.post()!.comments);
  }

  async onCommentCreated(text: string) {
    const dto: CommentCreateDto = {
      text,
      authorId: this.profileService()!.id,
      postId: this.post()!.id,
    };

    await firstValueFrom(this.postService.createComment(dto));
    const comments = await firstValueFrom(
      this.postService.getCommentByPostId(this.post()!.id)
    );
    this.comments.set(comments);
  }
}
