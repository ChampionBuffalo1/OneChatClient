import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type DateString = string;

export type MessageType = {
  id: string;
  text: string;
  author: {
    id: string;
    username: string;
    avatarUrl?: string;
  };
  createdAt: DateString;
  updatedAt?: DateString;
};

export type MessagePayload = MessageType & {
  group: {
    id: string;
    name: string;
    iconUrl: string | null;
    description: string;
  };
};

export type GroupType = {
  id: string;
  name: string;
  iconUrl?: string;
  description?: string;
  messages: MessageType[];
  owner?: {
    id: string;
    username: string;
    avatarUrl: string | null;
  };
};

export interface GroupStore {
  value: GroupType[];
}

const initialState: GroupStore = {
  value: []
};

const MAX_MESSAGE_LIMIT = 40;

export const GroupSlice = createSlice({
  name: 'group',
  initialState,
  reducers: {
    /**
     * Adds group to redux store
     */
    addGroup: (state, action: PayloadAction<GroupType | GroupType[]>) => {
      if (Array.isArray(action.payload)) {
        for (const group of action.payload) state.value.push(group);
      } else {
        state.value.push(action.payload);
      }
    },
    /**
     * Removes the group from the store using group id
     * @param action `id` of the group
     */
    removeGroup: (state, action: PayloadAction<string>) => {
      const id = state.value.findIndex(group => group.id === action.payload);
      if (id !== -1) {
        state.value.splice(id, 1);
      }
    },

    updateGroup: (state, action: PayloadAction<string>) => {},

    addMessage: (state, action: PayloadAction<MessagePayload>) => {
      const group = state.value.find(group => group.id === action.payload.group.id);
      if (!group) return;
      if (group.messages.length >= MAX_MESSAGE_LIMIT) {
        // NOTE: This will cause problem if fetching older messages and adding them into store
        // which may happen when the user scrolls up at the message UI part
        group.messages.shift();
      }
      group.messages.push(action.payload);
    },

    removeMessage: (state, action: PayloadAction<Pick<MessagePayload, 'id' | 'group'>>) => {
      const group = state.value.find(group => group.id === action.payload.group.id);
      if (!group) return;
      const messageIdx = group.messages.findIndex(msg => msg.id === action.payload.id);
      if (messageIdx !== -1) {
        group.messages.splice(messageIdx, 1);
      }
    },

    updateMessage: (state, action: PayloadAction<MessagePayload>) => {
      const group = state.value.find(group => group.id === action.payload.group.id);
      if (!group) return;
      const messageIdx = group.messages.findIndex(msg => msg.id === action.payload.id);
      if (messageIdx !== -1) {
        group.messages[messageIdx] = action.payload;
      }
    },

    changeIcon: (
      state,
      action: PayloadAction<{
        id: string;
        url: string;
      }>
    ) => {
      const group = state.value.find(group => group.id === action.payload.id);
      if (!group) return;
      group.iconUrl = action.payload.url;
    },

    /**
     * Resets the state of group
     */
    reset: state => {
      state.value = initialState.value;
    }
  }
});

export const { addGroup, changeIcon, removeGroup, addMessage, removeMessage, updateMessage, updateGroup, reset } =
  GroupSlice.actions;

export default GroupSlice.reducer;
