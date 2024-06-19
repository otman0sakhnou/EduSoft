import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilNotes, cilSpeedometer } from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _comptableNav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/comptable',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'Nouveau',
    },
  },
  {
    component: CNavTitle,
    name: 'Gestion des Factures',
  },
  {
    component: CNavGroup,
    name: 'Gestion des Factures',
    to: '/gestionFactures',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Régler les Factures',
        to: '/gestionFactures/regler-factures',
      },
      // {
      //   component: CNavItem,
      //   name: 'les Factures',
      //   to: '/gestionFactures/examiner-factures',
      // },
    ],
  },
]

export default _comptableNav
