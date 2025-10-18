import { firstValueFrom } from 'rxjs';
import { RouterLink } from '@angular/router';
import { Component, inject, effect, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AvatarUploadComponent, ProfileHeaderComponent } from '../../ui';
import { ProfileService } from '@tt/data-access';


@Component({
  selector: 'app-settings-pages',
  standalone: true,
  imports: [
    ProfileHeaderComponent,
    ReactiveFormsModule,
    RouterLink,
    AvatarUploadComponent,
  ],
  templateUrl: './settings-pages.component.html',
  styleUrl: './settings-pages.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsPagesComponent {
  fb = inject(FormBuilder);
  profileSerive = inject(ProfileService);
  cdr = inject(ChangeDetectorRef)

  @ViewChild(AvatarUploadComponent) avatarUploader!: AvatarUploadComponent;

  form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    username: [{ value: '', disabled: true }, Validators.required],
    description: [''],
    stack: [''],
  });

  constructor() {
    effect(() => {
      //@ts-ignore
      this.form.patchValue({
        ...this.profileSerive.me(),
        //@ts-ignore
        stack: this.mergeStack(this.profileSerive.me()?.stack),
      });
    });

    this.cdr.markForCheck()
  }


  onSave() {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();

    if (this.form.invalid) return;

    if (this.avatarUploader.avatar) {
      firstValueFrom(
        this.profileSerive.uploadAvatar(this.avatarUploader.avatar)
      );
    }


    firstValueFrom(
      // @ts-ignore
      this.profileSerive.patchProfile({
        ...this.form.value,
        stack: this.splitStack(this.form.value.stack),
      })
    );
  }

  splitStack(stack: string | null | string[] | undefined): string[] {
    if (!stack) return [];
    if (Array.isArray(stack)) return stack;

    return stack.split(',');
  }

  mergeStack(stack: string | null | string[] | undefined) {
    if (!stack) return '';
    if (Array.isArray(stack)) return stack.join(',');

    return stack;
  }
}
