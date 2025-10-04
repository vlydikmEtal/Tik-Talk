import { Component, inject, input, OnInit, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CommentComponent, PostInputComponent } from '../../ui';
import { Post, PostComment, PostService } from '../../data';
import { AvatarCircleComponent, SvgIconComponent } from '@tt/common-ui';
import { CommentCreateDto } from '../../data/interfaces/post.interfaces';
import { TimePipe } from '../../pipes/time.pipe';
import { ProfileService } from '@tt/profile';


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
