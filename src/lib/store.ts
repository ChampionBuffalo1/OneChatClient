import { configureStore } from '@reduxjs/toolkit';
import groupSlice from './reducers/groups';

export const reduxStore = configureStore({
  reducer: {
    groups: groupSlice
  }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof reduxStore.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof reduxStore.dispatch;
