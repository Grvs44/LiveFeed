export enum MessageType {
  Message,
  Next,
}

export type MessageContent = {
  message?:string
  time?:string
  type:MessageType
}
