import React from 'react'

const Filière = React.lazy(() => import('./BackOffice/filière/Filière'))
const Module = React.lazy(() => import('./BackOffice/module/Module'))
const Groupe = React.lazy(() => import('./BackOffice/groupe/Groupe'))
const User = React.lazy(() => import('./BackOffice/User'))
//Absence
const ReportAbsence = React.lazy(() => import('./BackOffice/absence/ReportAbsence'))
const Review = React.lazy(() => import('./BackOffice/absence/ReviewAbsence'))
//
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

const routes = [
  { path: '/', exact: true, name: 'Acceuil' },
  { path: '/gestion', name: 'Gestion', exact: true },
  { path: '/gestion/Filieres', name: 'Filieres', element: Filière },
  { path: '/gestion/Modules', name: 'Modules', element: Module },
  { path: '/gestion/Groupes', name: 'Groupes', element: Groupe },
  { path: '/Utilisateurs', name: 'Utilisateurs', exact: true },
  { path: '/Utilisateurs/Tous', name: 'Tous les utilisateurs', element: User },
  {
    path: '/Utilisateurs/register',
    name: 'Register',
    external: true,
    href: 'http://localhost:5001/Account/Register',
  },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/gestionAbsence', name: 'Gestion des Absences', exact: true },
  {
    path: '/gestionAbsence/signaler-absence',
    name: 'Signaler une Absence',
    element: ReportAbsence,
  },
  {
    path: '/gestionAbsence/examiner-absences',
    name: 'Examiner les Absences',
    element: Review,
  },
]

export default routes
