import { Component, input } from '@angular/core';
import { PostComment } from '../../data';
import { AvatarCircleComponent } from '@tt/common-ui';
import { TimePipe } from '../../pipes';



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
