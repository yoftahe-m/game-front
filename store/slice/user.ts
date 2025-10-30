import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  email: string;
  phone?: string;
  fullName: string;
  profilePic?: string;
  created_at: string;
  coins: number;
  rewards: number;
}

type UserState = {
  accessToken: string | null;
  refreshToken: string | null;
  data: User | null;
};

const initialState: UserState = {
  accessToken: null,
  refreshToken: null,
  data: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signin: (
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken: string;
        user: User;
      }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.data = action.payload.user;
    },
    setCredentials: (state, action: PayloadAction<{ accessToken: string; refreshToken: string }>) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    setCoins: (state, action: PayloadAction<{ amount: number }>) => {
      if (state.data) {
        state.data.coins += action.payload.amount;
      }
    },
    setUser: (state, action: PayloadAction<{ user: User }>) => {
      state.data = action.payload.user;
    },

    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.data = null;
    },
  },
});

export const { setCredentials, signin, logout, setUser,setCoins } = userSlice.actions;
export default userSlice.reducer;
