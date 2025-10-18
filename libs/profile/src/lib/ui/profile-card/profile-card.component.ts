import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { Input } from '@angular/core';
import { ImgUrlPipe } from '@tt/common-ui';
import { Profile } from '@tt/interfaces/profile';


@Component({
  selector: 'app-profile-card',
  standalone: true,
  imports: [ImgUrlPipe],
  templateUrl: './profile-card.component.html',
  styleUrl: './profile-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileCardComponent {
  cdr = inject(ChangeDetectorRef)

  @Input() profile!: Profile;

  constructor() {
    this.cdr.markForCheck()
  }
}
