import { WebPubSubClient } from '@azure/web-pubsub-client'

export type TitleState = {
  title: string
}

export type LiveStream = {
  name: string // Stream/recipe name
  stream: string // Video URL
  channel: string // PubSub channel
  group: string // PubSub group
  recipe: number // Recipe ID (if recipe in another record)
  shopping: number // Shopping list ID (if shopping list in another record)
}

export type RecipeStep = {
  id: number
  text: string
}

export type ShoppingListEntry = {
  id: number
  name: string
  quantity?: string
}

export type PubsubState = {
  client?: WebPubSubClient
}

export type State = {
  title: TitleState
  pubsub: PubsubState
}
