import { firstValueFrom } from 'rxjs';
import { RouterLink } from '@angular/router';
import { Component, inject, effect, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AvatarUploadComponent, ProfileHeaderComponent } from '../../ui';
import { ProfileService } from '@tt/data-access';
import { AddressInputComponent, StackInputComponent, SvgIconComponent } from '@tt/common-ui';


@Component({
  selector: 'app-settings-pages',
  standalone: true,
  imports: [
    ProfileHeaderComponent,
    ReactiveFormsModule,
    RouterLink,
    AvatarUploadComponent,
    StackInputComponent,
    AddressInputComponent
  ],
  templateUrl: './settings-pages.component.html',
  styleUrl: './settings-pages.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsPagesComponent {
  fb = inject(FormBuilder);
  profileService = inject(ProfileService);
  cdr = inject(ChangeDetectorRef)

  @ViewChild(AvatarUploadComponent) avatarUploader!: AvatarUploadComponent;

  form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    username: [{ value: '', disabled: true }, Validators.required],
    description: [''],
    stack: [''],
    city: [null]
  });

  constructor() {
    effect(() => {
      //@ts-ignore
      this.form.patchValue({
        ...this.profileService.me(),
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
        this.profileService.uploadAvatar(this.avatarUploader.avatar)
      );
    }


    firstValueFrom(
      // @ts-ignore
      this.profileService.patchProfile({
        ...this.form.value,
      })
    );
  }


}
