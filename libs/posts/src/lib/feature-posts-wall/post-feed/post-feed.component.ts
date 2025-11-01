import { firstValueFrom, fromEvent, Subscription } from 'rxjs';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { debounceTime } from 'rxjs/operators';
import { ElementRef, Renderer2, AfterViewInit, OnDestroy } from '@angular/core';
import { PostInputComponent } from '../../ui';
import { PostComponent } from '../post/post.component';
import { postActions, PostCreateDto, PostService, ProfileService, selectedPosts } from '@tt/data-access';
import { Store } from '@ngrx/store';


@Component({
  selector: 'app-post-feed',
  standalone: true,
  imports: [PostComponent, PostInputComponent],
  templateUrl: './post-feed.component.html',
  styleUrl: './post-feed.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostFeedComponent implements AfterViewInit, OnDestroy {
  postService = inject(PostService);
  profileService = inject(ProfileService);
  store = inject(Store)


  feed = this.store.selectSignal(selectedPosts)

  hostElement = inject(ElementRef);
  r2 = inject(Renderer2);

  #resizeSub?: Subscription;

  constructor() {
    this.store.dispatch(postActions.postsGet());
  }

  ngAfterViewInit() {
    this.resizeFeed();
    this.#resizeSub = fromEvent(window, 'resize')
      .pipe(debounceTime(200))
      .subscribe(() => this.resizeFeed());
  }

  resizeFeed() {
    const { top } = this.hostElement.nativeElement.getBoundingClientRect();
    const height = window.innerHeight - top - 48;
    this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`);
  }

  ngOnDestroy() {
    this.#resizeSub?.unsubscribe();
  }

  async onPostCreated(text: string) {
    const dto: PostCreateDto = {
      title: 'Клевый пост',
      content: text,
      autorId: this.profileService.me()!.id
    };

    await firstValueFrom(this.postService.createPost(dto));
    this.store.dispatch(postActions.postsGet());
  }
}
