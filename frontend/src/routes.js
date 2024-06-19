import React from 'react'

const Filière = React.lazy(() => import('./BackOffice/filière/Filière'))
const Module = React.lazy(() => import('./BackOffice/module/Module'))
const Groupe = React.lazy(() => import('./BackOffice/groupe/Groupe'))
const User = React.lazy(() => import('./BackOffice/User'))
const ReportAbsence = React.lazy(() => import('./BackOffice/absence/ReportAbsence'))
const Review = React.lazy(() => import('./BackOffice/absence/ReviewAbsence'))
const Facture = React.lazy(() => import('./BackOffice/facture/Facture'))
const ReviewFacture = React.lazy(() => import('./BackOffice/facture/ReviewWorkedHours'))
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const ComptableDashboard = React.lazy(() => import('./views/dashboard/ComptableDash'))
const ProfDashboard = React.lazy(() => import('./views/dashboard/ProfDashboard'))

const routes = [
  // { path: '/', exact: true, name: 'Home', element: Dashboard },
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
  { path: '/gestionFactures', name: 'Gestion des Factures', exact: true },
  {
    path: '/gestionFactures/examiner-factures',
    name: 'Les Factures',
    element: Facture,
  },
  {
    path: '/gestionFactures/regler-factures',
    name: 'Régler les Factures',
    element: ReviewFacture,
  },
  // Add role-specific paths here
  { path: '/admin', name: 'Admin Dashboard', element: Dashboard },
  { path: '/enseignant', name: 'Enseignant Dashboard', element: ProfDashboard },
  { path: '/absence', name: 'Absence Dashboard', element: Review },
  { path: '/comptable', name: 'Comptable Dashboard', element: ComptableDashboard },
]

export default routes
