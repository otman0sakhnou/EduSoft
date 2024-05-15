import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilBell, cilCursor, cilGroup, cilNotes, cilSpeedometer, cilUserPlus } from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'Nouveau',
    },
  },
  {
    component: CNavTitle,
    name: 'TÂCHES',
  },
  {
    component: CNavGroup,
    name: 'Gestion',
    to: '/gestion',
    icon: <CIcon icon={cilCursor} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Filières',
        to: '/gestion/Filieres',
      },
      {
        component: CNavItem,
        name: 'Modules',
        to: '/gestion/Modules',
      },
      {
        component: CNavItem,
        name: 'Groupes',
        to: '/gestion/Groupes',
      },
    ],
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
        name: 'Examiner les Absences',
        to: '/gestionAbsence/examiner-absences',
      },
      {
        component: CNavItem,
        name: 'Signaler une Absence',
        to: '/gestionAbsence/signaler-absence',
      },
    ],
  },
  {
    component: CNavTitle,
    name: 'Gestion des Factures',
  },
  {
    component: CNavGroup,
    name: 'Gestion des Factures',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Régler les Factures',
        to: '/regler-factures',
      },
      {
        component: CNavItem,
        name: 'Examiner les Factures',
        to: '/examiner-factures',
      },
    ],
  },
  {
    component: CNavTitle,
    name: 'Utilisateurs',
  },
  {
    component: 'a',
    name: 'Register',
    href: 'http://localhost:5001/Account/Register',
    icon: <CIcon icon={cilUserPlus} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'Nouveau',
    },
  },

  {
    component: CNavItem,
    name: 'Tous les utilisateurs',
    to: '/Utilisateurs/Tous',
    icon: <CIcon icon={cilGroup} customClassName="nav-icon" />,
  },
]

export default _nav
