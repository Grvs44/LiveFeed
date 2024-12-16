export type TitleState = {
  title: string
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

export type SocketUrlParams = {
  userId: string
  channelId: string
}

export type SocketUrl = {
  url: string
}

export type State = {
  title: TitleState
}
