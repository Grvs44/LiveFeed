import { WebPubSubClient } from '@azure/web-pubsub-client'
import store from './store'

export type TitleState = {
  title: string
}

export type LiveStream = {
  name: string // Stream/recipe name
  stream: string // Video URL
  streamer: string // PubSub channel
  group: string // PubSub group
  recipe: RecipeStep[]
  shopping: ShoppingListEntry[]
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
  id: number
  name: string
  quantity?: string
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

// Newly added *might need checking*
export type Item = {
  id: number 
  title: string
  thumbnail: string; // URL to the thumbnail image(?)
  link: string; 
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
}

