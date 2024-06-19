import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilBell, cilSpeedometer } from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _profNav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/enseignant',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'Nouveau',
    },
  },
  {
    component: CNavTitle,
    name: 'Gestion des Absences',
  },
  {
    component: CNavGroup,
    name: 'Gestion des Absences',
    to: '/gestionAbsence',
    icon: <CIcon icon={cilBell} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Signaler une Absence',
        to: '/gestionAbsence/signaler-absence',
      },
    ],
  },
]

export default _profNav
