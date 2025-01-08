import React from 'react'
import { HubConnectionBuilder } from '@microsoft/signalr'
import { useDispatch, useSelector } from 'react-redux'
import { useGetPreferencesQuery } from '../redux/apiSlice'
import { setNotif } from '../redux/notifSlice'
import { baseUrl } from '../redux/settings'
import { State } from '../redux/types'
import { LoginContext } from './LoginProvider'
import { StreamNotification } from './types'

export type ProviderValue = {
  connection?: signalR.HubConnection
  notifications: string[]
}

export type SignalRProviderProps = {
  children: React.ReactNode
  onNotification: (notification: string) => void
}

export const SignalRContext = React.createContext<ProviderValue>({
  notifications: [],
})

export default function SignalRProvider(props: SignalRProviderProps) {
  const [connection, setConnection] = React.useState<
    signalR.HubConnection | undefined
  >(undefined)
  const [notifications, setNotifications] = React.useState<string[]>([])
  const accessToken = useSelector((state: State) => state.token.token)
  const { activeAccount } = React.useContext(LoginContext)

  const dispatch = useDispatch()
  const token = useSelector((state: State) => state.token.token)
  const { data, isLoading } = useGetPreferencesQuery(undefined, {
    skip: token === undefined,
  })

  const notificationsEnabled = useSelector(
    (state: State) => state.notif.enabled,
  )

  React.useEffect(() => {
    if (data && data.notifications !== undefined) {
      dispatch(setNotif(data.notifications))
    }
  }, [data, dispatch])

  React.useEffect(() => {
    const headers: HeadersInit = {}
    if (activeAccount && accessToken) {
      headers.Authorization = 'Bearer ' + accessToken
      const userId = activeAccount.localAccountId
      headers['x-ms-signalr-userid'] = userId
    } else if (activeAccount || accessToken) {
      // Wait for accessToken
      return
    }

    const connectSignalR = async () => {
      try {
        const response = await fetch(`${baseUrl}notifications/negotiate`, {
          headers,
          method: 'POST',
        })
        const connectionInfo = await response.json()

        const newConnection = new HubConnectionBuilder()
          .withUrl(connectionInfo.url, {
            accessTokenFactory: () => connectionInfo.accessToken,
          })
          .withAutomaticReconnect()
          .build()

        newConnection.on('eventNotification', (notification: string) => {
          setNotifications([...notifications, notification])
          props.onNotification(notification)
          console.log('Notification received:', notification)
        })

        newConnection.on(
          'streamNotification',
          (notification: StreamNotification) => {
            if (notificationsEnabled) {
              props.onNotification(notification.message)
              console.log('Stream notification received:', notification.message)
            }
          },
        )

        await newConnection.start()
        console.log('SignalR Connected.')
        setConnection(newConnection)
      } catch (error) {
        console.error('SignalR Connection Error:', error)
      }
    }

    connectSignalR()

    return () => {
      if (connection) {
        connection.stop()
        console.log('SignalR Disconnected.')
      }
    }
  }, [activeAccount, accessToken])

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
