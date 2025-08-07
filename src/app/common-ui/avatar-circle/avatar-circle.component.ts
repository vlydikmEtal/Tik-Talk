import { Component } from '@angular/core';
import { ImgUrlPipe } from '../../helpers/pipes/img-url.pipe';
import { input } from '@angular/core';

@Component({
  selector: 'app-avatar-circle',
  standalone: true,
  imports: [ImgUrlPipe],
  templateUrl: './avatar-circle.component.html',
  styleUrl: './avatar-circle.component.scss',
})
export class AvatarCircleComponent {
  avatarUrl = input<string | null>();
}
