import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { baseUrl } from './settings'
import {
  EndStream,
  LiveStream,
  OndemandStream,
  RecipeStepChange,
  StartStream,
  State,
} from './types'

enum TagTypes {
  Live = 'live',
  Ondemand = 'vod',
}

// Adapted from https://github.com/Grvs44/budgetmanager/blob/main/budgetmanagerpwa/src/redux/apiSlice.ts
export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl,
    // prepareHeaders adapted from https://redux-toolkit.js.org/rtk-query/api/fetchBaseQuery#setting-default-headers-on-requests
    prepareHeaders(headers, api) {
      const token = (api.getState() as State).token.token
      if (token) headers.set('Authorization', `Bearer ${token}`)
    },
  }),
  tagTypes: Object.values(TagTypes),
  endpoints: (builder) => ({
    getLiveStream: builder.query<LiveStream, string>({
      query: (id) => `stream/${id}`,
      providesTags: (_result, _error, id) => [{ type: TagTypes.Live, id }],
    }),
    getOndemandStream: builder.query<OndemandStream, string>({
      query: (id) => `vod/${id}`,
      providesTags: (_result, _error, id) => [{ type: TagTypes.Ondemand, id }],
    }),
    startStream: builder.mutation<StartStream, string>({
      query: (id) => ({
        url: `stream/${id}/start/`,
        method: 'POST',
      }),
    }),
    endStream: builder.mutation<EndStream, string>({
      query: (id) => ({
        url: `stream/${id}/end/`,
        method: 'POST',
      }),
    }),
    changeStep: builder.mutation<string, RecipeStepChange>({
      query: ({ recipeId, stepId, time }) => ({
        url: `stream/${recipeId}/steps/next/`,
        method: 'POST',
        body: { stepId, time },
      }),
    }),
    createRecipe: builder.mutation<any, any>({
      query: (recipe) => ({
        url: '/recipe/create',
        method: 'POST',
        body: recipe,
      }),
    }),
    getRecipe: builder.mutation<any, any>({
      query: () => ({
        url: '/recipe/get',
        method: 'GET',
      }),
    }),
    updateRecipe: builder.mutation<any, any>({
      query: (recipe) => ({
        url: '/recipe/update',
        method: 'PUT',
        body: recipe,
      }),
    }),
    deleteRecipe: builder.mutation<any, any>({
      query: (recipe) => ({
        url: '/recipe/delete',
        method: 'POST',
        body: recipe,
      }),
    }),
  }),
})

export const {
  useGetLiveStreamQuery,
  useGetOndemandStreamQuery,
  useStartStreamMutation,
  useEndStreamMutation,
  useChangeStepMutation,
  useCreateRecipeMutation,
  useGetRecipeMutation,
  useUpdateRecipeMutation,
  useDeleteRecipeMutation,
} = apiSlice
