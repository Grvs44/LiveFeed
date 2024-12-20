import React from 'react'
import { PublicClientApplication } from '@azure/msal-browser'
import { MsalProvider } from '@azure/msal-react'
import { ThemeProvider } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App'
import { msalConfig } from './auth/authConfig'
import LoginProvider from './context/LoginProvider'
import ErrorPage from './pages/ErrorPage'
import HomePage from './pages/HomePage'
import LivePage from './pages/LivePage'
import OndemandPage from './pages/OndemandPage'
import RecipesPage from './pages/RecipesPage'
import SavedPage from './pages/SavedPage'
import SettingsPage from './pages/SettingsPage'
import WatchLivePage from './pages/WatchLivePage'
import WatchOndemandPage from './pages/WatchOndemandPage'
import LoginProvider from './context/LoginProvider'
import store from './redux/store'
import theme from './theme'

//Has to be initialised outside of the component tree
const msalInstance = new PublicClientApplication(msalConfig)

const router = createBrowserRouter(
  [
    {
      path: import.meta.env.BASE_URL,
      element: <App />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: '',
          element: <HomePage />,
        },
        {
          path: 'live',
          element: <LivePage />,
        },
        {
          path: 'live/:id',
          element: <WatchLivePage />,
        },
        {
          path: 'ondemand',
          element: <OndemandPage />,
        },
        {
          path: 'ondemand/:id',
          element: <WatchOndemandPage />,
        },
        {
          path: 'saved',
          element: <SavedPage />,
        },
        {
          path: 'recipes',
          element: <RecipesPage />,
        },
        {
          path: 'settings',
          element: <SettingsPage />,
        },
      ],
    },
  ],
  // React Router future flags adapted from https://stackoverflow.com/a/79228826/18309216
  {
    future: {
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true,
    },
  },
)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <MsalProvider instance={msalInstance}>
    <Provider store={store}>
      <LoginProvider>
        <ThemeProvider theme={theme}>
          <RouterProvider
            router={router}
            future={{ v7_startTransition: true }}
          />
          <CssBaseline />
        </ThemeProvider>
      </LoginProvider>
    </Provider>
  </MsalProvider>,
)
