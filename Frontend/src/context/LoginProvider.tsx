/*
https://learn.microsoft.com/en-us/entra/identity-platform/scenario-spa-acquire-token?tabs=react

The following code handles a login request and
listens to a response to update the active account.
Access token is accquired using the active account.

Issue: How to call handleRedirectResponse when page is reloaded?
*/
import React from 'react'
import { AccountInfo, AuthenticationResult } from '@azure/msal-browser'
import { useMsal } from '@azure/msal-react'
import { loginRequest } from '../auth/authConfig'

export type ProviderValue = {
  activeAccount: AccountInfo | null
  handleLoginRedirect?: () => void
  handleRedirectResponse?: () => Promise<void>
  getTokenSilently?: () => Promise<string | null>
  handleLogin?: () => Promise<void>
}

export type LoginProviderProps = {
  children: React.ReactNode
}

export const LoginContext = React.createContext<ProviderValue>({
  activeAccount: null,
})

export default function LoginProvider(props: LoginProviderProps) {
  const { instance } = useMsal()
  const [activeAccount, setActiveAccount] = React.useState(
    instance.getActiveAccount(),
  )

  const handleLoginRedirect = () => {
    console.log('Trying to login')
    instance.loginRedirect(loginRequest).catch((error) => {
      console.error('Login Redirect Error:', error)
    })
  }

  //Get response after user logs in (set the active account)
  const handleRedirectResponse = async () => {
    const response = await instance.handleRedirectPromise()
    if (response) {
      setActiveAccount(response.account)
      console.log('Active Account Set:', response.account)
    }
  }

  //Get access token from active account
  const getTokenSilently = async (): Promise<string | null> => {
    if (!activeAccount) {
      console.error('No active account found. User needs to log in.')
      return null
    }
    try {
      const tokenResponse: AuthenticationResult =
        await instance.acquireTokenSilent({
          ...loginRequest,
          account: activeAccount,
        })
      console.log('Access Token:', tokenResponse.accessToken)
      return tokenResponse.accessToken
    } catch (error) {
      console.error('Silent token access failed:', error)
      throw error
    }
  }

  //Login logic
  const handleLogin = async () => {
    try {
      handleLoginRedirect()
      await handleRedirectResponse()
      console.log('User logged in and response handled')
    } catch (error) {
      console.error('Error in login flow:', error)
    }
  }

  const value = {
    activeAccount,
    handleLoginRedirect,
    handleRedirectResponse,
    getTokenSilently,
    handleLogin,
  }

  return (
    <LoginContext.Provider value={value}>
      {props.children}
    </LoginContext.Provider>
  )
}
