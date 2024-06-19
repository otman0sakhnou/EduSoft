import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilSpeedometer } from '@coreui/icons'
import { CNavItem } from '@coreui/react'

const _navAbsence = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/absence',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'Nouveau',
    },
  },
]

export default _navAbsence
