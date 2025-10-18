import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, input, OnInit, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CommentComponent, PostInputComponent } from '../../ui';
import { AvatarCircleComponent, SvgIconComponent } from '@tt/common-ui';
import { TimePipe } from '../../pipes/time.pipe';
import { CommentCreateDto, Post, PostComment, PostService, ProfileService } from '@tt/data-access';


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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostComponent implements OnInit {
  post = input<Post>();
  comments = signal<PostComment[]>([]);

  cdr = inject(ChangeDetectorRef)

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
    console.log('All comments:', comments);
    this.comments.set(comments);
  }

  constructor() {
    setInterval(() => {
      this.cdr.markForCheck()
    }, 1000)
  }
}
