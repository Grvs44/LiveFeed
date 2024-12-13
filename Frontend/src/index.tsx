import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import App from './App'
import store from './redux/store'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material'
import theme from './theme'
import ErrorPage from './pages/ErrorPage'
import HomePage from './pages/HomePage'
import LivePage from './pages/LivePage'
import OndemandPage from './pages/OndemandPage'
import SavedPage from './pages/SavedPage'
import RecipesPage from './pages/RecipesPage'
import SettingsPage from './pages/SettingsPage'
import WatchLivePage from './pages/WatchLivePage'

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
  }
)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <React.StrictMode>
        <RouterProvider router={router} future={{ v7_startTransition: true }} />
        <CssBaseline />
      </React.StrictMode>
    </ThemeProvider>
  </Provider>
)
