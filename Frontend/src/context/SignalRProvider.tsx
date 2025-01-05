import React from 'react'
import { useSelector } from 'react-redux'
import { baseUrl } from '../redux/settings'
import { State } from '../redux/types'
import { HubConnectionBuilder } from '@microsoft/signalr'
import { LoginContext } from './LoginProvider'

export type ProviderValue = {
  connection?: signalR.HubConnection
  notifications: string[]
}

export type SignalRProviderProps = {
  children: React.ReactNode
  onNotification: (notification: string) => void
}

export const SignalRContext = React.createContext<ProviderValue>({
  notifications: []
})

export default function SignalRProvider(props: SignalRProviderProps) {
  const [connection, setConnection] = React.useState<signalR.HubConnection | undefined>(undefined)
  const [notifications, setNotifications] = React.useState<string[]>([])
  const accessToken = useSelector((state: State) => state.token.token)
  const { activeAccount } = React.useContext(LoginContext)

  React.useEffect(() => {
    const headers: HeadersInit = {}
    if (activeAccount && accessToken) {
      headers.Authorization = 'Bearer ' + accessToken
    } else if (activeAccount || accessToken) {
      // Wait for accessToken
      return
    }

    const connectSignalR = async () => {
      try {
        const response = await fetch(
          `${baseUrl}notifications/negotiate`,
          { headers, method: 'POST'},
        )
        console.log(response)
        const connectionInfo = await response.json()

        const newConnection = new HubConnectionBuilder()
        .withUrl(connectionInfo.url, {
          accessTokenFactory: () => connectionInfo.accessToken,
        })
        .withAutomaticReconnect()
        .build()

        newConnection.on("EventNotification", (notification: string) => {
          setNotifications([...notifications, notification])
          props.onNotification(notification)
          console.log("Notification received:", notification)
        })

        await newConnection.start()
        console.log("SignalR Connected.")
        setConnection(newConnection)
      } catch (error) {
        console.error("SignalR Connection Error:", error)
      }
    }

    connectSignalR()

    return () => {
      if (connection) {
        connection.stop()
        console.log("SignalR Disconnected.")
      }
    }
  })

  const value: ProviderValue = {
    connection,
    notifications,
  }

  return (
    <SignalRContext.Provider value={value}>
      {props.children}
    </SignalRContext.Provider>
  )
}