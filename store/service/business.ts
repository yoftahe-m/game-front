import { createApi } from "@reduxjs/toolkit/query/react";

import baseQueryWithReAuth from "../baseQuery";

interface reviewI {
  id: string;
  message: string;
  rating: number;
}

interface socialI {
  title: string;
  value: string;
}

export interface BusinessI {
  id: string;
  name: string;
  location: string;
  type: string;
  isFavorite: boolean;
  isBookmarked: boolean;
  images: string[];
  myReview: reviewI;
  reviews: reviewI[];
  reviewCount: number;
  description: string;
  socials: socialI[];
  coords: { latitude: number; longitude: number };
  distance_meters?:number;
}

export interface BusinessesI {
  businesses: BusinessI[];
  total: number;
  totalPages: number;
}

export const businessApi = createApi({
  reducerPath: "businessApi",
  baseQuery: baseQueryWithReAuth,
  endpoints: (builder) => ({
    getMyBusinesses: builder.query<BusinessesI, { page: number; size: number }>(
      {
        query: ({ page, size }) => {
          return {
            url: `business/myBusinesses?page=${page}&size=${size}`,
          };
        },
      }
    ),
    getMineBusiness: builder.query<BusinessI, { businessId: string }>({
      query: ({ businessId }) => {
        return {
          url: `business/mine/${businessId}`,
        };
      },
    }),
    addBusiness: builder.mutation({
      query: ({ data }) => {
        return {
          url: `business/register`,
          method: "POST",
          body: data,
        };
      },
    }),
    searchBusiness: builder.query<
      BusinessesI,
      {
        page: number;
        text: string;
        coords: string;
      }
    >({
      query: ({ text, coords, page }) => {
        return {
          url: `business/search?text=${text}&coords=${coords}&page=${page}`,
        };
      },
    }),
    getBusiness: builder.query<BusinessI, { businessId: string }>({
      query: ({ businessId }) => {
        return {
          url: `business/get/${businessId}`,
        };
      },
    }),
    likeBusiness: builder.mutation({
      query: ({ id }) => {
        return {
          url: `business/react/${id}`,
          method: "POST",
        };
      },
    }),
    bookmarkBusiness: builder.mutation({
      query: ({ id }) => {
        return {
          url: `business/bookmark/${id}`,
          method: "POST",
        };
      },
    }),
    reviewBusiness: builder.mutation({
      query: ({ id, data }) => {
        return {
          url: `business/review/${id}`,
          method: "POST",
          body: data,
        };
      },
    }),
    favoriteBusinesses: builder.query<BusinessesI, { page: number }>({
      query: ({ page }) => {
        return {
          url: `business/favorites?page=${page}`,
        };
      },
    }),
    bookmarkedBusinesses: builder.query<BusinessesI, { page: number }>({
      query: ({ page }) => {
        return {
          url: `business/bookmarked?page=${page}`,
        };
      },
    }),
    reviewedBusinesses: builder.query<BusinessesI, { page: number }>({
      query: ({ page }) => {
        return {
          url: `business/reviewed?page=${page}`,
        };
      },
    }),
    // deleteCourse: builder.mutation({
    //   query: (courseId) => {
    //     return {
    //       url: `course/delete/${courseId}`,
    //       method: "DELETE",
    //     };
    //   },
    // }),
  }),
});

export const {
  useGetMyBusinessesQuery,
  useAddBusinessMutation,
  useSearchBusinessQuery,
  useGetBusinessQuery,
  useLikeBusinessMutation,
  useBookmarkBusinessMutation,
  useReviewBusinessMutation,
  useFavoriteBusinessesQuery,
  useBookmarkedBusinessesQuery,
  useReviewedBusinessesQuery,
  useGetMineBusinessQuery,
  //   useDeleteCourseMutation,
} = businessApi;
