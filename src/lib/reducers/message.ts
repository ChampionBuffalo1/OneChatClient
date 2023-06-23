import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface MessageStore {
  value: {
    id: string;
    message: string;
    timestamp: string;
    sentBy: string;
  }[];
}

const initialState: MessageStore = {
  value: []
};

export const MessageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<string>) => {
      state.value.push({
        id: '1',
        message: action.payload,
        timestamp: '2021-01-01',
        sentBy: 'me'
      });
    },
    removeMessage: (state, messageId: PayloadAction<string>) => {
      const index = state.value.findIndex(message => message.id === messageId.payload);
      if (index !== -1) state.value.splice(index, 1);
    },

    editMessage: (state, action: PayloadAction<string>) => {
      const index = state.value.findIndex(message => message.id === action.payload);
      if (index !== -1) state.value[index].message = action.payload;
    }
  }
});

export const { addMessage, editMessage, removeMessage } = MessageSlice.actions;

export default MessageSlice.reducer;
