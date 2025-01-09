import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { baseUrl } from './settings'
import {
  EndStream,
  LiveStream,
  OndemandStream,
  RecipeStepChange,
  StartStream,
  State,
  StreamStartTime,
  UpdatePreferences,
  UserState,
} from './types'
import { setUser } from './userSlice'

enum TagTypes {
  Live = 'live',
  Ondemand = 'vod',
  Recipe = 'recipe',
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
      keepUnusedDataFor: 0,
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
    sendStreamStartTime: builder.mutation<string, StreamStartTime>({
      query: ({ id, time }) => ({
        url: `stream/${id}/time/`,
        method: 'POST',
        body: { time },
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
        body: { id: stepId, time },
      }),
    }),
    createRecipe: builder.mutation<any, any>({
      query: (recipe) => ({
        url: '/recipe/create',
        method: 'POST',
        body: recipe,
      }),
      invalidatesTags: () => [{ type: TagTypes.Recipe, id: 'list' }],
    }),
    getRecipe: builder.query<any, void>({
      query: () => ({
        url: '/recipe/get',
        method: 'GET',
      }),
      providesTags: (r) => [{ type: TagTypes.Recipe, id: 'list' }],
    }),
    displayRecipe: builder.mutation<any, any>({
      query: (id) => ({
        url: `/recipe/display?id=${id}`,
        method: 'GET',
      }),
    }),
    updateRecipe: builder.mutation<any, any>({
      query: (recipe) => ({
        url: '/recipe/update',
        method: 'PUT',
        body: recipe,
      }),
      invalidatesTags: () => [{ type: TagTypes.Recipe, id: 'list' }],
    }),
    deleteRecipe: builder.mutation<any, any>({
      query: (recipe) => ({
        url: '/recipe/delete',
        method: 'POST',
        body: recipe,
      }),
      invalidatesTags: () => [{ type: TagTypes.Recipe, id: 'list' }],
    }),
    getUpcomingRecipe: builder.mutation<any, void>({
      query: () => ({
        url: '/recipe/upcoming',
        method: 'GET',
      }),
    }),
    getStreamsInfo: builder.mutation<any, void>({
      query: () => ({
        url: '/streams',
        method: 'GET',
      }),
    }),
    updatePreferences: builder.mutation<any, UpdatePreferences>({
      query: ({ tags, notifications }) => ({
        url: `/settings/preferences`,
        method: 'PATCH',
        body: {
          tags,
          notifications,
        },
      }),
    }),
    getPreferences: builder.query<any, void>({
      query: () => ({
        url: '/settings/preferences',
        method: 'GET',
      }),
    }),
    updateUserDetails: builder.mutation<any, UserState>({
      query: ({ id, displayName, givenName, familyName }) => ({
        url: `/settings/user/update`,
        method: 'PATCH',
        body: {
          id,
          displayName,
          givenName,
          familyName,
        },
      }),
      async onQueryStarted(details, api) {
        await api.queryFulfilled
        api.dispatch(setUser(details))
      },
    }),
  }),
})

export const {
  useGetLiveStreamQuery,
  useGetOndemandStreamQuery,
  useGetPreferencesQuery,
  useStartStreamMutation,
  useSendStreamStartTimeMutation,
  useEndStreamMutation,
  useChangeStepMutation,
  useCreateRecipeMutation,
  useGetRecipeQuery,
  useUpdateRecipeMutation,
  useDeleteRecipeMutation,
  useGetUpcomingRecipeMutation,
  useGetStreamsInfoMutation,
  useDisplayRecipeMutation,
  useUpdatePreferencesMutation,
  useUpdateUserDetailsMutation,
} = apiSlice
