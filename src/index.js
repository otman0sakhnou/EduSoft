import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import 'core-js'

import App from './App'
import store from './store'
import ToasProviders from './Providers/ToastProviders'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <ToasProviders />
    <App />
  </Provider>,
)
