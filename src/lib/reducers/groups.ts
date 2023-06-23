import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface GroupStore {
  value: string;
}

const initialState: GroupStore = {
  value: ''
};

export const GroupSlice = createSlice({
  name: 'group',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
    //   state.value = action.payload;
    }
  }
});

export const { setToken } = GroupSlice.actions;

export default GroupSlice.reducer;
