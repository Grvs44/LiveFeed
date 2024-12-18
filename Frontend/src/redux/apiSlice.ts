import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { LiveStream } from './types'
import { baseUrl } from './settings'

enum TagTypes {
  Live = 'live',
}

// Adapted from https://github.com/Grvs44/budgetmanager/blob/main/budgetmanagerpwa/src/redux/apiSlice.ts
export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl,
  }),
  tagTypes: Object.values(TagTypes),
  endpoints: (builder) => ({
    getLiveStream: builder.query<LiveStream, string>({
      query: (id) => `live/${id}`,
      providesTags: (_result, _error, id) => [{ type: TagTypes.Live, id }],
    }),
  }),
})

export const {
  useGetLiveStreamQuery,
} = apiSlice
