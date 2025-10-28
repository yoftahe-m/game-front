import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MenuItemI } from '../service/restaurant';

type OrderState = {
  data: MenuItemI[];
};

const initialState: OrderState = {
  data: [],
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<MenuItemI>) => {
      const item = action.payload;
      const existing = state.data.find((i) => i.id === item.id);

      if (existing) {
        existing.count = (existing.count || 0) + 1;
      } else {
        state.data.push({ ...item, count: 1 });
      }
    },

    removeItem: (state, action: PayloadAction<string>) => {
      state.data = state.data.filter((i) => i.id !== action.payload);
    },

    increaseCount: (state, action: PayloadAction<string>) => {
      const item = state.data.find((i) => i.id === action.payload);
      if (item) {
        item.count = (item.count || 0) + 1;
      }
    },

    decreaseCount: (state, action: PayloadAction<string>) => {
      const item = state.data.find((i) => i.id === action.payload);
      if (item) {
        if ((item.count || 0) > 1) {
          item.count! -= 1;
        } else {
          state.data = state.data.filter((i) => i.id !== action.payload);
        }
      }
    },

    clearOrder: (state) => {
      state.data = [];
    },
  },
});

export const { addItem, removeItem, increaseCount, decreaseCount, clearOrder } = orderSlice.actions;

export default orderSlice.reducer;
