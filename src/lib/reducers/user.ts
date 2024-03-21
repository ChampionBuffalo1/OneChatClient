import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type UserData = {
  id: string;
  createdAt: Date;
  username: string;
  avatarUrl?: string;
};

type InitialStates = {
  data: UserData;
};

const initialState: InitialStates = {
  data: {
    id: '',
    username: '',
    avatarUrl: '',
    createdAt: new Date()
  }
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    reset: state => {
      state.data = initialState.data;
    },
    setUser: (state, action: PayloadAction<UserData>) => {
      state.data = action.payload;
    },
    updateUsername: (state, action: PayloadAction<string>) => {
      state.data.username = action.payload;
    },
    updateAvatar: (state, action: PayloadAction<string>) => {
      state.data.avatarUrl = action.payload;
    }
  }
});

export const { reset, setUser, updateAvatar, updateUsername } = userSlice.actions;

export default userSlice.reducer;
