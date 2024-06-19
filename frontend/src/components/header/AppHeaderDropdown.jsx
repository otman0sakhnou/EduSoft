import React from 'react'
import {
  CAvatar,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import { cilLockLocked, cilSettings } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useAuth } from 'react-oidc-context'
import chroma from 'chroma-js'

const AppHeaderDropdown = () => {
  const auth = useAuth()

  const handleLogout = () => {
    auth.signoutRedirect({ post_logout_redirect_uri: 'http://localhost:5001/Account/Login' })
  }

  const getInitials = (fullName) => {
    const nameParts = fullName.split(' ')
    const firstNameInitial = nameParts[0]?.charAt(0).toUpperCase() || ''
    const lastNameInitial = nameParts[1]?.charAt(0).toUpperCase() || ''
    return `${firstNameInitial}${lastNameInitial}`
  }

  const getColor = (name) => {
    const scale = chroma.scale(['#fafa6e', '#2A4858']).mode('lch').colors(10)
    const hash = Array.from(name).reduce((acc, char) => char.charCodeAt(0) + acc, 0)
    return scale[hash % scale.length]
  }

  const userName = auth.user?.profile?.name || ''
  const initials = getInitials(userName)
  const avatarColor = getColor(userName)

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
        <CAvatar style={{ backgroundColor: avatarColor, color: 'white' }} status="success ">
          {initials}
        </CAvatar>
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-body-secondary fw-semibold my-2">Settings</CDropdownHeader>
        <CDropdownItem href="#">
          <CIcon icon={cilSettings} className="me-2" />
          Paramètres
        </CDropdownItem>
        <CDropdownDivider />
        <CDropdownItem onClick={handleLogout}>
          <CIcon icon={cilLockLocked} className="me-2" />
          Déconnecter
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
