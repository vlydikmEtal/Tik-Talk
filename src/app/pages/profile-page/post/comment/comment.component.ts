import { Component, input } from '@angular/core';
import { AvatarCircleComponent } from '../../../../common-ui/avatar-circle/avatar-circle.component';
import { PostComment } from '../../../../data/interfaces/post.interfaces';
import { TimePipe } from '../../../../helpers/pipes/time.pipe';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [AvatarCircleComponent, TimePipe],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss',
})
export class CommentComponent {
  comment = input<PostComment>();
}
