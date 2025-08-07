import { firstValueFrom } from 'rxjs';
import { RouterLink } from '@angular/router';
import { Component, inject, effect, ViewChild } from '@angular/core';
import { ProfileHeaderComponent } from '../../common-ui/profile-header/profile-header.component';
import { FormBuilder, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ProfileService } from '../../data/services/profile.service';
import { AvatarUploadComponent } from "./avatar-upload/avatar-upload.component";


@Component({
  selector: 'app-settings-pages',
  standalone: true,
  imports: [ProfileHeaderComponent, ReactiveFormsModule, RouterLink, AvatarUploadComponent],
  templateUrl: './settings-pages.component.html',
  styleUrl: './settings-pages.component.scss',
})
export class SettingsPagesComponent {
  fb = inject(FormBuilder);
  profileSerive = inject(ProfileService);

  @ViewChild(AvatarUploadComponent) avatarUploader!: AvatarUploadComponent

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
  }

  ngAfterViewInit() {

  }

  onSave() {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();

    if (this.form.invalid) return;

    if (this.avatarUploader.avatar) {
      firstValueFrom(this.profileSerive.uploadAvatar(this.avatarUploader.avatar))
    }

    // @ts-ignore
    firstValueFrom(this.profileSerive.patchProfile({
      ...this.form.value,
      stack: this.splitStack(this.form.value.stack),
    }));
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
