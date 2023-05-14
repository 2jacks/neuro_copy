import React from 'react'
import ReactDOM from 'react-dom/client'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import Restricted from './components/Restricted/Restricted'
import Main from '@features/main/Main'
import Auth from '@features/auth/Auth'

import './index.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Restricted>
        <Main />
      </Restricted>
    )
  },
  {
    path: 'auth',
    element: <Auth />
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
