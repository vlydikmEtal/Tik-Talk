import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, input } from '@angular/core';
import { AvatarCircleComponent } from '@tt/common-ui';
import { TimePipe } from '../../pipes';
import { PostComment } from '@tt/data-access';





@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [AvatarCircleComponent, TimePipe],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommentComponent {
  cdr = inject(ChangeDetectorRef)

  comment = input<PostComment>();

  constructor() {
    this.cdr.markForCheck();
  }
}
