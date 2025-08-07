import { firstValueFrom, fromEvent } from 'rxjs';
import { PostService } from './../../../data/services/post.service';
import { Component, inject, HostListener } from '@angular/core';
import { PostComponent } from '../post/post.component';
import { PostInputComponent } from '../post-input/post-input.component';
import { ElementRef, Renderer2 } from '@angular/core';


@Component({
  selector: 'app-post-feed',
  standalone: true,
  imports: [PostComponent, PostInputComponent],
  templateUrl: './post-feed.component.html',
  styleUrl: './post-feed.component.scss',
})
export class PostFeedComponent {
  postService = inject(PostService);
  feed = this.postService.posts;

  hostElement = inject(ElementRef);
  r2 = inject(Renderer2);

  @HostListener('window:resize')
  onWindowResize() {
    this.resizeFeed();
  }

  constructor() {
    firstValueFrom(this.postService.fetchPosts());
  }

  ngAfterViewInit() {
    this.resizeFeed();

    fromEvent(window, 'resize')
      .subscribe(() => {
        console.log(123)
      })
  }

  resizeFeed() {
    const { top } = this.hostElement.nativeElement.getBoundingClientRect();

    const height = window.innerHeight - top - 24 - 24;
    this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`);
  }
}
