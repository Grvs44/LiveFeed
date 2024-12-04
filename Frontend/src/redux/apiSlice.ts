import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Adapted from https://github.com/Grvs44/budgetmanager/blob/main/budgetmanagerpwa/src/redux/apiSlice.ts
export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.BASE_URL + import.meta.env.VITE_API_URL,
  }),
  tagTypes: [],
  endpoints: (builder) => ({}),
})
