import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { input } from '@angular/core';
import { ImgUrlPipe } from '../../pipes';

@Component({
  selector: 'app-avatar-circle',
  standalone: true,
  imports: [ImgUrlPipe],
  templateUrl: './avatar-circle.component.html',
  styleUrl: './avatar-circle.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AvatarCircleComponent {
  avatarUrl = input<string | null>();

}
