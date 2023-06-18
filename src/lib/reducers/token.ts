import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface TokenStore {
  value: string;
}

const initialState: TokenStore = {
  value: ''
};

export const TokenSlice = createSlice({
  name: 'token',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    }
  }
});

export const { setToken } = TokenSlice.actions;

export default TokenSlice.reducer;
