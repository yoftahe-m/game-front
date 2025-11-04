import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type SettingsState = {
  soundEnabled: boolean;
};

const initialState: SettingsState = {
  soundEnabled: true,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    toggleSound: (state) => {
      state.soundEnabled = !state.soundEnabled;
    },
    setSound: (state, action: PayloadAction<boolean>) => {
      state.soundEnabled = action.payload;
    },
  },
});

export const { toggleSound, setSound } = settingsSlice.actions;
export default settingsSlice.reducer;
