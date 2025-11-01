import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DndDirective, ImgUrlPipe, SvgIconComponent } from '@tt/common-ui';
import { ProfileService } from '@tt/data-access';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-avatar-upload',
  standalone: true,
  imports: [SvgIconComponent, DndDirective, FormsModule, ImgUrlPipe],
  templateUrl: './avatar-upload.component.html',
  styleUrl: './avatar-upload.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AvatarUploadComponent {
  profileService = inject(ProfileService);

  preview = signal<string>('/assets/imgs/avatar-placeholder.png');

  cdr = inject(ChangeDetectorRef);

  avatar: File | null = null;

  fileBrowserHandler(event: Event) {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    this.processFile(file);
  }

  onFileDropped(file: File) {
    this.processFile(file);
  }

  processFile(file: File | null | undefined) {
    if (!file || !file.type.match('image')) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      this.preview.set(event.target?.result?.toString() ?? '');
    };

    reader.readAsDataURL(file);
    this.avatar = file;
  }

  constructor() {
    this.profileService
      .getMe()
      .pipe(takeUntilDestroyed())
      .subscribe(profile => {
        if (profile.avatarUrl) {
          this.preview.set(profile.avatarUrl);
        }
        this.cdr.markForCheck();
      });
  }
}
