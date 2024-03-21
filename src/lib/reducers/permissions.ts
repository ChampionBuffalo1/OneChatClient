import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type PermissionData = {
  id: string;
  permission: number;
};

type InitialStates = {
  // Group ID => Permission
  value: Record<string, number>;
};

const initialState: InitialStates = {
  value: {}
};
// Only stores logged in user's permission for each group
export const permSlice = createSlice({
  name: 'permission',
  initialState,
  reducers: {
    reset: state => {
      state.value = initialState.value;
    },
    setPermission: (state, action: PayloadAction<PermissionData>) => {
      state.value[action.payload.id] = action.payload.permission;
    },
    deletePermission: (state, action: PayloadAction<Omit<PermissionData, 'permission'>>) => {
      delete state.value[action.payload.id];
    }
  }
});

export const { reset, setPermission, deletePermission } = permSlice.actions;
export default permSlice.reducer;
