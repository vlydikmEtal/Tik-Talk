import { Post } from "../interfaces/post.interfaces";
import { createFeature, createReducer, on } from '@ngrx/store';
import { postActions } from './actions';


export interface PostsState {
  posts: Post[]
}

export const initialStateSecond: PostsState = {
  posts: []
}

export const postsFeature = createFeature({
  name: 'postsFeature',
  reducer: createReducer(
    initialStateSecond,
    on(postActions.postsLoaded, (state, payload) => {
      return {
        ...state,
        posts: payload.posts,
      }
    })
  )
})
