import React, { useContext } from 'react'
import { PublicClientApplication } from '@azure/msal-browser'
import { MsalProvider } from '@azure/msal-react'
import { ThemeProvider } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import App from './App'
import { msalConfig } from './config/authConfig'
import LoginProvider, { LoginContext } from './context/LoginProvider'
import ErrorPage from './pages/ErrorPage'
import HomePage from './pages/HomePage'
import LivePage from './pages/LivePage'
import OndemandPage from './pages/OndemandPage'
import RecipesPage from './pages/RecipesPage'
import SavedPage from './pages/SavedPage'
import SettingsPage from './pages/SettingsPage'
import StartStreamPage from './pages/StartStreamPage'
import UpcomingListPage from './pages/UpcomingListPage'
import UpcomingRecipesPage from './pages/UpcomingRecipesPage'
import WatchLivePage from './pages/WatchLivePage'
import WatchOndemandPage from './pages/WatchOndemandPage'
import store from './redux/store'
import theme from './theme'

//Has to be initialised outside of the component tree
const msalInstance = new PublicClientApplication(msalConfig)

function AppRouter() {
  const { activeAccount } = useContext(LoginContext)
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
            path: 'live/:id/start',
            element: <StartStreamPage />,
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
            path: 'upcoming/:id',
            element: <UpcomingRecipesPage />,
          },
          {
            path: 'upcoming',
            element: <UpcomingListPage />,
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
            element: activeAccount ? <SettingsPage /> : <Navigate to="/" />,
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
  return <RouterProvider router={router} />
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <MsalProvider instance={msalInstance}>
    <Provider store={store}>
      <LoginProvider>
        <ThemeProvider theme={theme}>
          <AppRouter />
          <CssBaseline />
        </ThemeProvider>
      </LoginProvider>
    </Provider>
  </MsalProvider>,
)
