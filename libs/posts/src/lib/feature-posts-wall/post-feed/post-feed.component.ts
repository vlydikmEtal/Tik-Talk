import { firstValueFrom, fromEvent, Subscription } from 'rxjs';
import { Component, inject } from '@angular/core';
import { debounceTime } from 'rxjs/operators';
import { ElementRef, Renderer2, AfterViewInit, OnDestroy } from '@angular/core';
import { PostService } from '../../data';
import { PostInputComponent } from '../../ui';
import { PostCreateDto } from '../../data/interfaces/post.interfaces';
import { ProfileService } from '@tt/profile';
import { PostComponent } from '../post/post.component';



@Component({
  selector: 'app-post-feed',
  standalone: true,
  imports: [PostComponent, PostInputComponent],
  templateUrl: './post-feed.component.html',
  styleUrl: './post-feed.component.scss',
})
export class PostFeedComponent implements AfterViewInit, OnDestroy {
  postService = inject(PostService);
  profileService = inject(ProfileService);

  feed = this.postService.posts;

  hostElement = inject(ElementRef);
  r2 = inject(Renderer2);

  #resizeSub?: Subscription;

  constructor() {
    firstValueFrom(this.postService.fetchPosts());
  }

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
    const height = window.innerHeight - top - 48;
    this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`);
  }

  async onPostCreated(text: string) {
    const dto: PostCreateDto = {
      title: 'Клевый пост',
      content: text,
      autorId: this.profileService.me()!.id
    };

    await firstValueFrom(this.postService.createPost(dto));
    await firstValueFrom(this.postService.fetchPosts());
  }
}
