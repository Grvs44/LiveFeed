import React from 'react'
import { AccountInfo, AuthenticationResult } from '@azure/msal-browser'
import { useMsal } from '@azure/msal-react'
import { baseUrl } from '../redux/settings'

export type ProviderValue = {
  accessToken: string | null
  handleStart?: () => Promise<void>
}

export type StreamProviderProps = {
  children: React.ReactNode
}

export const StreamContext = React.createContext<ProviderValue>({
  accessToken: null
})

export default function StreamProvider(props: StreamProviderProps) {
  const { instance } = useMsal()
  const [activeAccount, setActiveAccount] = React.useState(
    instance.getActiveAccount(),
  )
  const [accessToken, setAccessToken] = React.useState<string | null>(null);
  const tokenRequest = {
    scopes: ['https://livefeedlog.onmicrosoft.com/livefeed-api/user.read'], // Backend scope
  };

  const handleStart = async () => {
    try {
        const response = await instance.acquireTokenSilent(tokenRequest);
        setAccessToken(response.accessToken)

        console.log("Acquired access token: " + accessToken)
    
        // Use the token in an API request to your backend
        const apiResponse = await fetch(`${baseUrl}stream/start`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`, // Include the token in the Authorization header
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "recipeName": "hello"
          })
        });
    
        const result = await apiResponse.json();
        console.log('Backend API Response:', result);
      } catch (error : any) {
        console.error('Token acquisition or API call failed:', error);
    
        // Fallback to interactive login if silent token acquisition fails
        if (error.name === 'InteractionRequiredAuthError') {
          const response = await instance.acquireTokenPopup(tokenRequest);
          const token = response.accessToken;
    
          // Retry the API call with the new token
          const apiResponse = await fetch('https://your-backend-endpoint/api', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data: 'your-request-data' }),
          });
    
          const result = await apiResponse.json();
          console.log('Backend API Response:', result);
        }
      }  
  }

  const value = {
      accessToken,
      handleStart
    }
  
    return (
      <StreamContext.Provider value={value}>
        {props.children}
      </StreamContext.Provider>
    )
}