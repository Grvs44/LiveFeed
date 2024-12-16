export enum MessageType {
  Message,
  Next,
}

export type MessageContent = {
  message?:string
  time?:number
  type:MessageType
}
