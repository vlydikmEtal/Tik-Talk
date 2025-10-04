import { switchMap } from 'rxjs';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { debounceTime, startWith } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SvgIconComponent } from '@tt/common-ui';
import { ProfileService } from '../../data';


@Component({
  selector: 'app-profile-filters',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SvgIconComponent],
  templateUrl: './profile-filters.component.html',
  styleUrl: './profile-filters.component.scss',
})
export class ProfileFiltersComponent {
  fb = inject(FormBuilder);
  ProfileService = inject(ProfileService);

  searchForm = this.fb.group({
    firstName: [''],
    lastName: [''],
    stack: [''],
  });

  constructor() {
    this.searchForm.valueChanges
      .pipe(
        startWith({}),
        debounceTime(300),
        switchMap((formValue) => {
          return this.ProfileService.filterProfiles(formValue);
        }),
        takeUntilDestroyed()
      )
      .subscribe();
  }
}
