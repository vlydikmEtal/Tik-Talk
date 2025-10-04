import { Component, inject, ElementRef, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { ProfileCardComponent } from '../../ui';
import { ProfileFiltersComponent } from '../profile-filters/profile-filters.component';
import { ProfileService } from '../../data';

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [ProfileCardComponent, ProfileFiltersComponent, CommonModule],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss',
})
export class SearchPageComponent {
  ProfileService = inject(ProfileService);
  profiles = this.ProfileService.filteredProfiles;

  hostElement = inject(ElementRef);
  r2 = inject(Renderer2);

  #resizeSub?: Subscription;

  ngAfterViewInit() {
    this.resizeFeed();

    this.#resizeSub = fromEvent(window, 'resize')
      .pipe(debounceTime(200))
      .subscribe(() => this.resizeFeed());
  }

  ngOnDestroy() {
    this.#resizeSub?.unsubscribe();
  }

  resizeFeed() {
    const { top } = this.hostElement.nativeElement.getBoundingClientRect();
    const height = window.innerHeight - top - 24 - 24;
    this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`);
  }
}
