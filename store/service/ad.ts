import { createApi } from "@reduxjs/toolkit/query/react";

import baseQueryWithReAuth from "../baseQuery";
import { BusinessI } from "./business";

interface AdI {
  description: string;
  image: string;
  business_id: string;
  business?: BusinessI;
}

export const adApi = createApi({
  reducerPath: "adApi",
  baseQuery: baseQueryWithReAuth,
  endpoints: (builder) => ({
    getAds: builder.query<AdI[], { location: string }>({
      query: ({ location }) => {
        return {
          url: `ad/get?location=${location}`,
        };
      },
    }),
    getHomeAds: builder.query<{ type: string; ads: AdI[] }[], any>({
      query: () => {
        return {
          url: `ad/get/home`,
        };
      },
    }),
    postAd: builder.mutation({
      query: (data) => {
        return {
          url: `ad/post`,
          method: "POST",
          body: data,
          formData: true,
        };
      },
    }),
  }),
});

export const { useGetAdsQuery, useGetHomeAdsQuery, usePostAdMutation } = adApi;
