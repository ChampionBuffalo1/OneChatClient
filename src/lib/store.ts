import userSlice from './reducers/user';
import groupSlice from './reducers/groups';
import { configureStore } from '@reduxjs/toolkit';
import permSlice from './reducers/permissions';

export const reduxStore = configureStore({
  reducer: {
    user: userSlice,
    perms: permSlice,
    groups: groupSlice
  }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof reduxStore.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof reduxStore.dispatch;
