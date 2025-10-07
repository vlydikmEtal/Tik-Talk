import { inject, Injectable } from '@angular/core';
import { PostService } from '../services/post.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { postActions } from './actions';
import { map, switchMap } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class PostsEffects {
  postService = inject(PostService)
  actions$ = inject(Actions)

  fetchPost = createEffect(() => {
    return this.actions$.pipe(
      ofType(postActions.postsGet),

      switchMap(() => {
        return this.postService.fetchPosts()
      }),

      map(posts => postActions.postsLoaded({posts: posts}))
    )
  })
}
