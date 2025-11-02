import { createApi } from "@reduxjs/toolkit/query/react";

import baseQueryWithReAuth from "../baseQuery";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: baseQueryWithReAuth,
  endpoints: (builder) => ({
    signup: builder.mutation({
      query: ({ data }) => {
        return {
          url: `user/register`,
          method: "POST",
          body: data,
        };
      },
    }),
    signin: builder.mutation({
      query: ({ data }) => {
        return {
          url: `user/login`,
          method: "POST",
          body: data,
        };
      },
    }),
    changeName: builder.mutation({
      query: (data) => {
        return {
          url: `user/changeName`,
          method: "POST",
          body: data,
        };
      },
    }),
    changeProfilePic: builder.mutation({
      query: (data) => {
        return {
          url: `user/changeProfilePic`,
          method: "POST",
          body: data,
          formData: true,
        };
      },
    }),
    changeProfile: builder.mutation({
      query: (data) => {
        return {
          url: `user/changeProfile`,
          method: "POST",
          body: data,
          formData: true,
        };
      },
    }),
  }),
});

export const { useSignupMutation, useSigninMutation, useChangeNameMutation,useChangeProfilePicMutation,useChangeProfileMutation } =
  userApi;
