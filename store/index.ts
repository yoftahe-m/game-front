import { combineReducers } from 'redux';
import * as SecureStore from 'expo-secure-store';
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';

import { adApi } from './service/ad';
import userReducer from './slice/user';
import orderReducer from './slice/order';
import { userApi } from './service/user';
import { businessApi } from './service/business';
import { transactionApi } from './service/transaction';
import { restaurantApi } from './service/restaurant';

const persistConfig = {
  key: 'root',
  storage: {
    getItem: async (key: string) => {
      try {
        return await SecureStore.getItemAsync(key.replace(':', '-'));
      } catch (error) {
        return null;
      }
    },
    setItem: async (key: string, value: string) => {
      try {
        return await SecureStore.setItemAsync(key.replace(':', '-'), value);
      } catch (error) {
        return null;
      }
    },
    removeItem: async (key: string) => {
      try {
        return await SecureStore.deleteItemAsync(key.replace(':', '-'));
      } catch (error) {
        return null;
      }
    },
  },
  whitelist: ["user"],
};

const rootReducer = combineReducers({
  user: userReducer,
  order: orderReducer,
  [adApi.reducerPath]: adApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [businessApi.reducerPath]: businessApi.reducer,
  [restaurantApi.reducerPath]: restaurantApi.reducer,
  [transactionApi.reducerPath]: transactionApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(userApi.middleware, businessApi.middleware, adApi.middleware, restaurantApi.middleware,transactionApi.middleware),
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
