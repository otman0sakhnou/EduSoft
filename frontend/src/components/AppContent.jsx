import React, { Suspense, useEffect, useState } from 'react'
import { useLocation, Navigate, Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'
import { useAuth } from 'react-oidc-context'

// routes config
import routes from '../routes'

const AppContent = () => {
  const { user } = useAuth()
  const location = useLocation()
  const [redirectPath, setRedirectPath] = useState(null)

  useEffect(() => {
    if (user) {
      const userRole = user.profile.userRole
      let path = ''
      switch (userRole) {
        case 'Admin':
          path = '/admin'
          break
        case 'Enseignant':
          path = '/enseignant'
          break
        case "Responsable d'Absence":
          path = '/absence'
          break
        case 'Comptable':
          path = '/comptable'
          break
      }
      if (location.pathname === '/') {
        setRedirectPath(path)
      }
    }
  }, [user, location])

  const ÉtudiantParGroupePage = React.lazy(() => import('../BackOffice/étudiant/ÉtudiantParGroupe'))

  return (
    <CContainer className="px-4" lg>
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          {routes.map(
            (route, idx) =>
              route.element && (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  element={<route.element />}
                />
              ),
          )}
          <Route
            path="/étudiant/ÉtudiantParGroupe/:nomGroupe"
            element={<ÉtudiantParGroupePage />}
          />
          {redirectPath && <Route path="/" element={<Navigate to={redirectPath} replace />} />}
        </Routes>
      </Suspense>
    </CContainer>
  )
}

export default React.memo(AppContent)
