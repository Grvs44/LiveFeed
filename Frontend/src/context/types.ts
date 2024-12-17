export type Chat = {
  id: number
  username: string
  message: string
  time: number
}

export enum MessageType {
  Message,
  Next,
}

export type MessageContent = {
  message?:string
  time?:number
  type:MessageType
}
