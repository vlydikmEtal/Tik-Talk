import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Post } from '../interfaces/post.interfaces';

export const postActions = createActionGroup({
  source: 'posts',
  events: {
    'posts get': emptyProps(),
    'posts loaded': props<{posts: Post[]}>(),
  }
})
