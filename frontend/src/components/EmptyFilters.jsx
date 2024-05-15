import React from 'react'
import { CRow, CCol, CCard, CCardBody, CCardHeader } from '@coreui/react'
import { useAuth } from 'react-oidc-context'
import PropTypes from 'prop-types'

export default function EmptyFilter({
  title = 'No matches for this filter',
  subtitle = 'Try changing or resetting the filter',
  showReset,
  showLogin,
}) {
  const auth = useAuth()
  const reset = () => {}

  return (
    <CRow className="h-[40vw] flex flex-col gap-2 justify-center items-center">
      <CCol>
        <CCard>
          <CCardHeader>
            <h1>{title}</h1>
          </CCardHeader>
          <CCardBody>
            <p>{subtitle}</p>
            {showLogin && (
              <button onClick={() => auth.signinRedirect()} className="btn btn-outline-primary">
                Login
              </button>
            )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}
EmptyFilter.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  showReset: PropTypes.bool,
  showLogin: PropTypes.bool,
}
