/*
https://learn.microsoft.com/en-us/entra/identity-platform/scenario-spa-acquire-token?tabs=react

The following code handles a login request and
listens to a response to update the active account.
Access token is accquired using the active account.

Issue: How to call handleRedirectResponse when page is reloaded?
*/
import React from 'react'
import { AccountInfo, SilentRequest } from '@azure/msal-browser'
import { useMsal } from '@azure/msal-react'
import { useDispatch } from 'react-redux'
import { loginRequest } from '../auth/authConfig'
import { setToken } from '../redux/tokenSlice'

export type ProviderValue = {
  activeAccount: AccountInfo | null
  idToken: string | null
  handleLoginPopup?: () => void
  //handleRedirectResponse?: () => Promise<void>
  handleLogin?: () => Promise<void>
}

export type LoginProviderProps = {
  children: React.ReactNode
}

export const LoginContext = React.createContext<ProviderValue>({
  activeAccount: null,
  idToken: null,
})

export default function LoginProvider(props: LoginProviderProps) {
  const dispatch = useDispatch()
  const { instance } = useMsal()
  const [activeAccount, setActiveAccount] = React.useState(
    instance.getActiveAccount(),
  )
  const [idToken, setIdToken] = React.useState<string | null>(null)

  const handleLoginPopup = async () => {
    try {
      const response = await instance.loginPopup(loginRequest)
      if (response) {
        setActiveAccount(response.account)
        instance.setActiveAccount(response.account)
        setIdToken(response.idToken)
        console.log('Login successful via popup')
      }
      if (activeAccount && activeAccount.idToken) {
        console.log('ID Token from AccountInfo:', activeAccount.idToken)
      } else {
        console.log('ID Token is not directly available in AccountInfo.')
      }
      return response
    } catch (error) {
      console.error('Error during popup login:', error)
      throw error
    }
  }

  /** 
  //Get response after user logs in (set the active account)
  const handleRedirectResponse = async () => {
    const response = await instance.handleRedirectPromise()
    if (response) {
      setActiveAccount(response.account)
      console.log('Active Account Set:', response.account)
      setIdToken(response.idToken)
      console.log('ID Token:', response.idToken);
    }
  }
  */

  //Get access token from active account
  const getAccessTokenSilently: () => Promise<string | null> = async () => {
    const tokenRequest: SilentRequest = {
      scopes: ['https://livefeedlog.onmicrosoft.com/livefeed-api/user.read'], // Backend scope
      account: activeAccount ? activeAccount : undefined,
    }
    try {
      await instance.initialize()
      const response = await instance.acquireTokenSilent(tokenRequest)
      const token = response.accessToken
      console.log(response)
      console.log('Obtained access token: ' + token)
      dispatch(setToken(token))
      return token
    } catch (error: any) {
      console.error('Token acquisition failed:', error)

      // Fallback to interactive login if silent token acquisition fails
      if (error.name === 'InteractionRequiredAuthError') {
        const response = await instance.acquireTokenPopup(tokenRequest)
        const token = response.accessToken
        dispatch(setToken(token))
        return token
      }
    }
    return null
  }

  const handleLogin: ProviderValue['handleLogin'] = async () => {
    console.log('Handle login invoked')
    try {
      const token = await getAccessTokenSilently()
      if (token) {
        console.log(`Active account is ${activeAccount}`)
        console.log(`Access token is ${token}`)
      }
      const response = await handleLoginPopup()
      if (response) {
        console.log('ID Token from popup:', response.idToken)
        console.log('Account from popup:', response.account)
      }
      console.log('User logged in and response handled')
    } catch (error) {
      console.error('Error in login flow:', error)
    }
  }

  // Restore active account on load
  React.useEffect(() => {
    const cachedAccount = instance.getActiveAccount()
    if (!cachedAccount) {
      const accounts = instance.getAllAccounts()
      if (accounts.length > 0) {
        instance.setActiveAccount(accounts[0])
        setActiveAccount(accounts[0])
        console.log('Restored Active Account from cache:', accounts[0])
        getAccessTokenSilently()
      } else {
        console.log('No accounts found in cache. User needs to log in.')
      }
    } else {
      setActiveAccount(cachedAccount)
      console.log('Active Account already set:', cachedAccount)
      getAccessTokenSilently()
    }
  }, [instance])

  const value: ProviderValue = {
    activeAccount,
    idToken,
    handleLoginPopup,
    //handleRedirectResponse,
    //getTokenSilently,
    handleLogin,
  }

  return (
    <LoginContext.Provider value={value}>
      {props.children}
    </LoginContext.Provider>
  )
}
