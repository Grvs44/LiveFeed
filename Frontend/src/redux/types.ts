import { WebPubSubClient } from '@azure/web-pubsub-client'
import store from './store'

export type TitleState = {
  title: string
}

export enum LiveStatus {
  Initial,
  Started,
  Stopped,
}

export type LiveStream = {
  input: string // Input URL
  name: string // Stream/recipe name
  stream: string // Video URL
  streamer: string // PubSub channel
  group: string // PubSub group
  recipe: RecipeStep[]
  shopping: ShoppingListEntry[]
  liveStatus: LiveStatus
}

export type OndemandStream = {
  name: string
  stream: string
  streamer: string
  recipe: TimedRecipeStep[]
  shopping: ShoppingListEntry[]
}

export type RecipeStep = {
  id: number
  text: string
  time?: number
}

export type TimedRecipeStep = RecipeStep & {
  time: number // Time from start of video in seconds
}

export type ShoppingListEntry = {
  item: string
  quantity?: string
  unit?: string
}

export type PubsubState = {
  client?: WebPubSubClient
}

export type TokenState = {
  token?: string
}

export type StartStream = {
  // stream data
  id?: string
}

export type StreamStartTime = {
  id: string
  time: number
}

export type EndStream = {
  // stream data
  id?: string
}

export type RecipeStepChange = {
  recipeId: string
  stepId: number
  time: number
}

export type State = ReturnType<typeof store.getState>

export type Item = {
  id: string
  streamer: string 
  title: string
  thumbnail: string
  liveState: number
  tags?: string[]
  link: string 
}

export type SectionProps = {
  title: string
  items: Item[]
}

export type Recipe = {
  user_id : string,
  id: string,
  title: string;
  date: string;
  steps: RecipeStep[];
  shopping: { item: string; quantity: number; unit: string }[];
  image: string;
  cookTime: number;
  servings: number;
  tags: string[];
}

export type TagsState = {
  tags?: string[];
}

export type UpdatePreferences = {
  tags?: string[];
  notifications?: boolean
}

export type UserState = {
  id? : string,
  displayName?: string,
  givenName?: string,
  familyName? : string,
}

export type NotificationState = {
  enabled?: boolean
}

