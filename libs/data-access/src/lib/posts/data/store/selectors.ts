import { createSelector } from '@ngrx/store';
import { postsFeature } from './reducer';
import { Post } from '../interfaces/post.interfaces';

export const selectedPosts = createSelector(
  postsFeature.selectPosts,
  (posts: Post[]) => posts
)
