import { configureStore } from '@reduxjs/toolkit';
import tokenSlice from './reducers/token';

export const reduxStore = configureStore({
  reducer: {
    token: tokenSlice
  }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof reduxStore.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof reduxStore.dispatch;
