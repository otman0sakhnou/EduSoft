import React from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import { withAuthenticationRequired, useAuth } from 'react-oidc-context'

const DefaultLayout = () => {
  const PrivateAppContent = withAuthenticationRequired(AppContent, {
    onRedirecting: () => <div>Redirecting to the login page...</div>,
  })
  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1">
          <PrivateAppContent />
        </div>
        <AppFooter />
      </div>
    </div>
  )
}
export default DefaultLayout
