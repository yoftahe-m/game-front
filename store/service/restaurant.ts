import { createApi } from '@reduxjs/toolkit/query/react';

import baseQueryWithReAuth from '../baseQuery';

export interface RestaurantsI {
  restaurants: RestaurantI[];
  total: number;
  totalPages: number;
}
export interface MenusI {
  menus: MenuItemI[];
  total: number;
  totalPages: number;
}

export interface RestaurantI {
  id: string;
  user_id: string;
  name: string;
  description: string;
  location: string;
  rating: number;
  images: string[];
  menus: MenuI[];
  bookmarked: boolean;
  phone: string;
  coordinate: CoordinateI;
}

export interface CoordinateI {
  latitude: number;
  longitude: number;
}
interface MenuI {
  items: MenuItemI[];
  category: string;
}

export interface MenuItemI {
  name: string;
  price: number;
  image: string;
  id: string;
  description: string;
  rating: number;
  category?: string;
  user_id?: string;
  restaurant_id?: string;
  count?: number;
}

export interface ReviewI {
  id: string;
  created_at: string;
  full_name: string;
  picture: string | null;
  review: string;
  rating: number;
}

export interface ReviewsI {
  reviews: ReviewI[];
  total: number;
  totalPages: number;
  myReview: {
    rating: number;
    review: string;
  };
}

export const restaurantApi = createApi({
  reducerPath: 'restaurantApi',
  baseQuery: baseQueryWithReAuth,
  endpoints: (builder) => ({
    getFeaturedRestaurants: builder.query<RestaurantsI, { page: number; size: number; coord: { latitude: number; longitude: number } }>({
      query: ({ page, size, coord }) => {
        return {
          url: `restaurants/featured?page=${page}&size=${size}&latitude=${coord.latitude}&longitude=${coord.longitude}`,
        };
      },
    }),
    getRestaurant: builder.query<RestaurantI, { id: string }>({
      query: ({ id }) => {
        return {
          url: `restaurants/get/${id}`,
        };
      },
    }),
    getMyRestaurants: builder.query<RestaurantsI, { page: number; size: number }>({
      query: ({ page, size }) => {
        return {
          url: `restaurants/mine?page=${page}&size=${size}`,
        };
      },
    }),
    getBookmarkedRestaurants: builder.query<RestaurantsI, { page: number; size: number }>({
      query: ({ page, size }) => {
        return {
          url: `restaurants/bookmarked?page=${page}&size=${size}`,
        };
      },
    }),
    getBookmarkedMenus: builder.query<MenusI, { page: number; size: number }>({
      query: ({ page, size }) => {
        return {
          url: `restaurants/menus/bookmarked?page=${page}&size=${size}`,
        };
      },
    }),
    bookmark: builder.mutation({
      query: ({ data }) => {
        return {
          url: `restaurants/bookmark`,
          method: 'POST',
          body: data,
        };
      },
    }),
    searchRestaurant: builder.query<RestaurantsI, { name: string; page: number; size: number }>({
      query: ({ page, size, name }) => {
        return {
          url: `restaurants/search/${name}?page=${page}&size=${size}`,
        };
      },
    }),
    searchMenu: builder.query<MenusI, { name: string; page: number; size: number }>({
      query: ({ page, size, name }) => {
        return {
          url: `restaurants/menus/search/${name}?page=${page}&size=${size}`,
        };
      },
    }),
    addRestaurant: builder.mutation({
      query: ({ data }) => {
        return {
          url: `restaurants/register`,
          method: 'POST',
          body: data,
        };
      },
    }),
    editRestaurant: builder.mutation({
      query: ({ data }) => {
        return {
          url: `restaurants/edit`,
          method: 'POST',
          body: data,
        };
      },
    }),
    getMenuReviews: builder.query<ReviewsI, { page: number; size: number; menuId: string }>({
      query: ({ page, size, menuId }) => {
        return {
          url: `restaurants/reviews?page=${page}&size=${size}&menu_id=${menuId}`,
        };
      },
    }),
    reviewMenu: builder.mutation({
      query: ({ id, data }) => {
        return {
          url: `restaurants/review/${id}`,
          method: 'POST',
          body: data,
        };
      },
    }),
    addMenu: builder.mutation({
      query: ({ data }) => {
        return {
          url: `restaurants/menu/register`,
          method: 'POST',
          body: data,
        };
      },
    }),
    editMenu: builder.mutation({
      query: ({ data }) => {
        return {
          url: `restaurants/menu/edit`,
          method: 'POST',
          body: data,
        };
      },
    }),
    deleteMenu: builder.mutation({
      query: ({ id }) => {
        return {
          url: `restaurants/menu/delete/${id}`,
          method: 'DELETE',
        };
      },
    }),
  }),
});

export const {
  useGetFeaturedRestaurantsQuery,
  useGetRestaurantQuery,
  useSearchRestaurantQuery,
  useSearchMenuQuery,
  useAddRestaurantMutation,
  useEditRestaurantMutation,
  useGetMyRestaurantsQuery,
  useGetBookmarkedRestaurantsQuery,
  useGetMenuReviewsQuery,
  useReviewMenuMutation,
  useBookmarkMutation,
  useAddMenuMutation,
  useEditMenuMutation,
  useDeleteMenuMutation,
  useGetBookmarkedMenusQuery
} = restaurantApi;
