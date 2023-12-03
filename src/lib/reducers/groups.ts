import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const MAX_MESSAGE_PER_GROUP = 100;

export type MessageType = {
  id: string;
  text: string;
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
  owner: {
    id: string;
    username: string;
  };
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
    removeGroup: (state, action: PayloadAction<string>) => {
      const index = state.value.findIndex(group => group.id === action.payload);
      if (index === -1) return;
      state.value.splice(index, 1);
    },
    addMessage: (
      state,
      action: PayloadAction<{
        id: string;
        message: MessageType;
      }>
    ) => {
      const index = state.value.findIndex(group => group.id === action.payload.id);
      if (index === -1) return;
      const messages = state.value[index].messages;
      if (messages.length >= MAX_MESSAGE_PER_GROUP) {
        // Assuming the messages are sorted by time
        // Removing the oldest message from store to keep memory usage down
        messages.shift();
      }
      messages.push(action.payload.message);
    }
  }
});

export const { addGroup, addMessage,removeGroup } = GroupSlice.actions;

export default GroupSlice.reducer;
