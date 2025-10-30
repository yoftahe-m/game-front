import { createApi } from '@reduxjs/toolkit/query/react';

import baseQueryWithReAuth from '../baseQuery';

export interface TransactionI {
  id: string;
  created_at: string;
  amount: number;
  type: string;
  game?: string;
}

export interface TransactionsI {
  transactions: TransactionI[];
  total: number;
  totalPages: number;
}

export interface LeaderI {
  id: string;
  full_name: string;
  amount: number;
  picture?: string;
  email: string;
}

export interface LeadersI {
  leaders: LeaderI[];
  total: number;
  totalPages: number;
}

export const transactionApi = createApi({
  reducerPath: 'transactionApi',
  baseQuery: baseQueryWithReAuth,
  endpoints: (builder) => ({
    getTransactionHistory: builder.query<TransactionsI, { page: number; size: number }>({
      query: ({ page, size }) => {
        return {
          url: `transaction/history?page=${page}&size=${size}`,
        };
      },
    }),
    getLeaderboard: builder.query<LeadersI, { page: number; size: number }>({
      query: ({ page, size }) => {
        return {
          url: `transaction/leaderboard?page=${page}&size=${size}`,
        };
      },
    }),
  }),
});

export const { useGetTransactionHistoryQuery, useGetLeaderboardQuery } = transactionApi;
