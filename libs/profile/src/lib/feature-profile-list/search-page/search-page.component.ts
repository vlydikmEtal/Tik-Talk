import { Component, inject, ElementRef, Renderer2, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { ProfileCardComponent } from '../../ui';
import { ProfileFiltersComponent } from '../profile-filters/profile-filters.component';
import { Store } from '@ngrx/store';
import { profileActions, selectFilteredProfiles } from '@tt/data-access';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';


@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [ProfileCardComponent, ProfileFiltersComponent, CommonModule, InfiniteScrollDirective],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss',
})
export class SearchPageComponent implements AfterViewInit, OnDestroy {
  store = inject(Store)
  profiles = this.store.selectSignal(selectFilteredProfiles)

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

  timeToFetch() {
    this.store.dispatch(profileActions.setPage({}))
  }

  onScroll() {
    this.timeToFetch()
  }

  onIntersection(entries: IntersectionObserverEntry[]) {
    if (!entries.length) return

    if (entries[0].intersectionRatio > 0) {
      this.timeToFetch();
    }
  }
}
