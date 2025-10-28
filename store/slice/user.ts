import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  email: string;
  phone?: string;
  fullName: string;
  profilePic?: string;
  created_at: string;
}

type UserState = {
  accessToken: string | null;
  refreshToken: string | null;
  data: User | null;
  coord: {
    latitude: number;
    longitude: number;
  };
};

const initialState: UserState = {
  accessToken: null,
  refreshToken: null,
  data: null,
  coord: {
    latitude: 0,
    longitude: 0,
  },
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
    setUser: (state, action: PayloadAction<{ user: User }>) => {
      state.data = action.payload.user;
    },
    setCoord: (
      state,
      action: PayloadAction<{
        coord: {
          latitude: number;
          longitude: number;
        };
      }>
    ) => {
      state.coord = action.payload.coord;
    },
    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.data = null;
    },
  },
});

export const { setCredentials, signin, logout, setUser, setCoord } = userSlice.actions;
export default userSlice.reducer;
