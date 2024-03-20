import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type PermissionData = {
  groupId: string;
  userId: string;
  permission: number;
};

type InitialStates = {
  value: PermissionData[];
};

const initialState: InitialStates = {
  value: []
};

export const permSlice = createSlice({
  name: 'permission',
  initialState,
  reducers: {
    reset: state => {
      state.value = initialState.value;
    },

    setPermission: (state, action: PayloadAction<PermissionData>) => {
      state.value.push(action.payload);
    },
    deletePermission: (state, action: PayloadAction<Omit<PermissionData, 'permission'>>) => {
      const permission = state.value.findIndex(
        perm => perm.userId === action.payload.userId && perm.groupId === action.payload.groupId
      );
      if (permission !== -1) {
        state.value.splice(permission, 1);
      }
    }
  }
});

export const { reset, setPermission, deletePermission } = permSlice.actions;
export default permSlice.reducer;
