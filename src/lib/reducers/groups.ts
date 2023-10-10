import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export type MessageType = {
  id: string;
  content: string;
  author: {
    id: string;
    username: string;
    avatarUrl: string;
  };
};

type GroupType = {
  name: string;
  id: string;
  messages: MessageType[];
};
export interface GroupStore {
  value: GroupType[];
}

const initialState: GroupStore = {
  value: []
};

export const GroupSlice = createSlice({
  name: 'group',
  initialState,
  reducers: {
    addGroup: (state, action: PayloadAction<GroupType | GroupType[]>) => {
      if (Array.isArray(action.payload)) {
        state.value.push(...action.payload);
      } else {
        state.value.push(action.payload);
      }
    },
    addMessage: (
      state,
      action: PayloadAction<{
        id: string;
        message: MessageType;
      }>
    ) => {
      const index = state.value.findIndex(group => group.id === action.payload.id);
      if (index != -1) {
        state.value[index].messages.push(action.payload.message);
      }
    }
  }
});

export const { addGroup, addMessage } = GroupSlice.actions;

export default GroupSlice.reducer;
