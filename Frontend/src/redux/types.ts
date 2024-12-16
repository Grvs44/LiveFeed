export type TitleState = {
  title: string
}

export type Chat = {
  id: number
  username: string
  message: string
  time: number
}

export type ChatState = {
  chats: Chat[]
  clientReady:boolean
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
  chat: ChatState
}
