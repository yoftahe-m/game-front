import type { FetchArgs, BaseQueryFn, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { getSocket } from '@/socket';
import type { RootState } from './index';
import { setCredentials, logout } from './slice/user';

export const baseQuery = fetchBaseQuery({
  baseUrl: 'http://192.168.94.60:8100/api/',
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).user.accessToken;
    if (token) headers.set('authorization', `Bearer ${token}`);

    return headers;
  },
});

const baseQueryWithReAuth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    const refreshToken = (api.getState() as RootState).user.refreshToken;

    if (refreshToken) {
      const refreshResponse = await baseQuery({ url: '/user/refreshToken', method: 'POST', body: { refreshToken } }, api, extraOptions);

      const data = refreshResponse.data as {
        accessToken: string;
        refreshToken: string;
      } | null;

      if (data) {
        api.dispatch(
          setCredentials({
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          })
        );
        const socket = getSocket();
        if (socket) socket.emit('refresh_token', data.accessToken);
        result = await baseQuery(args, api, extraOptions);
      } else {
        api.dispatch(logout());
      }
    }
  }
  return result;
};

export default baseQueryWithReAuth;
