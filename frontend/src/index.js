import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import 'core-js'
import { AuthProvider } from 'react-oidc-context'
import App from './App'
import store from './store'
import ToasProviders from './Providers/ToastProviders'
import { WebStorageStateStore } from 'oidc-client-ts'

const onSigninCallback = (user) => {
  window.history.replaceState({}, document.title, window.location.pathname)
}
const oidcConfig = {
  authority: 'http://localhost:5001',
  client_id: 'reactApp',
  redirect_uri: 'http://localhost:3000/callback',
  scope: 'openid profile edusoftapp',
  response_type: 'code',
  client_secret: 'secret',
  userStore: new WebStorageStateStore({ store: window.localStorage }),
  automaticSilentRenew: true,
  loadUserInfo: true,
  onSigninCallback: onSigninCallback,
}

createRoot(document.getElementById('root')).render(
  <AuthProvider {...oidcConfig}>
    <Provider store={store}>
      <ToasProviders />
      <App />
    </Provider>
  </AuthProvider>,
)
