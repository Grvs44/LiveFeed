export type Chat = {
  id: number
  username: string
  message: string
  time: number
}

export enum MessageType {
  Message,
  Step,
  Start,
  End,
}

export type MessageContent = {
  message?: string
  step?: number
  time?: number
  content?: StepUpdate
  type: MessageType
}

export type UserInfo = {
  name?: string
  given_name?: string
  family_name?: string
}

export type StepUpdate = {
  id: number
  time: number
}