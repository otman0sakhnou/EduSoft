/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useState } from 'react'
import {
  CAvatar,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CProgress,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cibCcAmex,
  cibCcApplePay,
  cibCcMastercard,
  cibCcPaypal,
  cibCcStripe,
  cibCcVisa,
  cifBr,
  cifEs,
  cifFr,
  cifIn,
  cifMa,
  cifPl,
  cifUs,
  cilPeople,
} from '@coreui/icons'

import avatar1 from 'src/assets/images/avatars/1.jpg'
import avatar2 from 'src/assets/images/avatars/2.jpg'
import avatar3 from 'src/assets/images/avatars/3.jpg'
import avatar4 from 'src/assets/images/avatars/4.jpg'
import avatar5 from 'src/assets/images/avatars/5.jpg'
import avatar6 from 'src/assets/images/avatars/6.jpg'

import { getAllFactures } from '../../Actions/BackOfficeActions/FactureActions'
import { getGroupes } from '../../Actions/BackOfficeActions/GroupeActions'
import { getModules } from '../../Actions/BackOfficeActions/ModuleActions'
import { getFilières } from '../../Actions/BackOfficeActions/FilièreActions'
import { getUsers } from '../../Actions/UserActions/getUsers'
import { getStudents } from '../../Actions/BackOfficeActions/ÉtudiantActions'
import { getAllSessions } from '../../Actions/BackOfficeActions/SéanceActions'
import SalaryWidget from '../widgets/Admin/SalaryWidget'
import FilièreWidget from '../widgets/Admin/FilièreWidget'
import GroupeWidget from '../widgets/Admin/GroupeWidget'
import UsersWidget from '../widgets/Admin/UsersWidget'
import ProfessorDetailsWidget from '../widgets/Prof/ProfessorDetailsWidget'
import chroma from 'chroma-js'

const Dashboard = () => {
  const [enseignantCount, setEnseignantCount] = useState(0)
  const [modulesCount, setModulesCount] = useState(0)
  const [absencePercentage, setAbsencePercentage] = useState(0)
  const [sessionsCount, setSessionsCount] = useState(0)
  const [users, setUsers] = useState([])

  useEffect(() => {
    const fetchUsers = async () => {
      const users = await getUsers()
      const enseignantCount = users.filter((user) => user.roleName === 'Enseignant').length
      setEnseignantCount(enseignantCount)
      setUsers(users)
    }

    fetchUsers()
  }, [])
  useEffect(() => {
    const fetchModules = async () => {
      const modules = await getModules()
      const modulesCount = modules.length
      setModulesCount(modulesCount)
    }
    fetchModules()
  })
  useEffect(() => {
    const fetchSessionsAndStudents = async () => {
      const sessions = await getAllSessions()
      const studentsData = await getStudents()
      const currentWeekSessions = filterCurrentWeekSessions(sessions)
      const { totalStudents, totalAbsences } = calculateAbsenceStats(
        currentWeekSessions,
        studentsData,
      )
      const absencePercentage =
        totalStudents > 0 ? ((totalAbsences / totalStudents) * 100).toFixed(2) : 0
      setAbsencePercentage(absencePercentage)
      setSessionsCount(currentWeekSessions.length)
    }

    fetchSessionsAndStudents()
  }, [])

  const filterCurrentWeekSessions = (sessions) => {
    const now = new Date()
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 1))
    const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 7))
    return sessions.filter((session) => {
      const sessionDate = new Date(session.dateSéance)
      return sessionDate >= startOfWeek && sessionDate <= endOfWeek
    })
  }

  const calculateAbsenceStats = (sessions, studentsData) => {
    let totalStudents = 0
    let totalAbsences = 0

    sessions.forEach((session) => {
      const sessionGroupId = session.groupeId
      const studentsInGroup = studentsData.filter((student) => student.idGroupe === sessionGroupId)
      const absences = session.étudiantsAbsents.length
      totalStudents += studentsInGroup.length
      totalAbsences += absences
    })

    return { totalStudents, totalAbsences }
  }
  const progressColors = ['primary', 'secondary', 'success', 'danger', 'warning', 'info']

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
  const getTimeAgoString = (lastLoginDate) => {
    const now = new Date()
    const loginDate = new Date(lastLoginDate)
    const diffMilliseconds = now - loginDate

    const seconds = Math.floor(diffMilliseconds / 1000)
    if (seconds < 5 * 60) {
      return '5 seconds ago'
    } else if (seconds < 60 * 60) {
      const minutes = Math.floor(seconds / 60)
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
    } else if (seconds < 24 * 60 * 60) {
      const hours = Math.floor(seconds / (60 * 60))
      return `${hours} hour${hours > 1 ? 's' : ''} ago`
    } else if (now.getFullYear() === loginDate.getFullYear()) {
      return loginDate.toLocaleDateString()
    } else {
      return loginDate.toLocaleDateString()
    }
  }

  return (
    <>
      <CRow xs={{ gutter: 4 }}>
        <FilièreWidget getFilieres={getFilières} />
        <UsersWidget getStudents={getStudents} getUsers={getUsers} />
      </CRow>
      <CRow xs={{ gutter: 4 }}>
        <SalaryWidget getFacture={getAllFactures} />
        <GroupeWidget getGroupes={getGroupes} getFilieres={getFilières} />
      </CRow>
      <CCard className="mb-4"></CCard>
      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>Traffic {' & '} Sales</CCardHeader>
            <CCardBody>
              <CRow>
                <CCol xs={12} md={6} xl={12}>
                  <CRow>
                    <CCol sm>
                      <div className="border-start border-start-4 border-start-info py-1 px-3 mb-3">
                        <div className="text-body-secondary text-truncate small">Proffesseur</div>
                        <div className="fs-5 fw-semibold">{enseignantCount}</div>
                      </div>
                    </CCol>
                    <CCol sm>
                      <div className="border-start border-start-4 border-start-danger py-1 px-3 mb-3">
                        <div className="text-body-secondary text-truncate small">
                          Module enseignés
                        </div>
                        <div className="fs-5 fw-semibold">{modulesCount}</div>
                      </div>
                    </CCol>
                    <CCol sm>
                      <div className="border-start border-start-4 border-start-success py-1 px-3 mb-3">
                        <div className="text-body-secondary text-truncate small">
                          Séances effectuées (semaine actuelle)
                        </div>
                        <div className="fs-5 fw-semibold">{sessionsCount}</div>
                      </div>
                    </CCol>
                    <CCol sm>
                      <div className="border-start border-start-4 border-start-warning py-1 px-3 mb-3">
                        <div className="text-body-secondary text-truncate small">
                          Pourcentage d'absence (semaine actuelle)
                        </div>
                        <div className="fs-5 fw-semibold">{absencePercentage} %</div>
                      </div>
                    </CCol>
                  </CRow>
                  <hr className="mt-0" />
                  <CRow>
                    <ProfessorDetailsWidget
                      getseance={getAllSessions}
                      getStudentData={getStudents}
                    />
                  </CRow>
                </CCol>
              </CRow>

              <br />

              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead className="text-nowrap">
                  <CTableRow>
                    <CTableHeaderCell className="bg-body-tertiary text-center">
                      <CIcon icon={cilPeople} />
                    </CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Utilisateur</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center">
                      Pays
                    </CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Utilisation</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center">
                      Mode de paiement
                    </CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Activité</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {users.map((user, index) => (
                    <CTableRow v-for="item in tableItems" key={index}>
                      <CTableDataCell className="text-center">
                        <CAvatar
                          status={user.isOnline ? 'success' : 'danger'}
                          style={{ backgroundColor: getColor(user.fullName) }}
                        >
                          {getInitials(user.fullName)}
                        </CAvatar>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>{user.fullName}</div>
                        <div className="small text-body-secondary text-nowrap">
                          <span>{user.roleName}</span> | Créer:{' '}
                          {new Date(user.accountCreationDate).toLocaleDateString()}
                        </div>
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CIcon size="xl" icon={cifMa} />
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="d-flex justify-content-between text-nowrap">
                          <div className="fw-semibold">
                            {user.usagePercentage ? Math.floor(user.usagePercentage) : 0}%
                          </div>
                          <div className="ms-3">
                            <small className="text-body-secondary">{}</small>
                          </div>
                        </div>
                        <CProgress
                          thin
                          color={progressColors[index]}
                          value={user.usagePercentage}
                        />
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CIcon size="xl" icon={cibCcVisa} />
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="small text-body-secondary text-nowrap">
                          Dernière connexion
                        </div>
                        <div className="fw-semibold text-nowrap">
                          {new Date(user.lastLoginDate).toLocaleDateString()}
                        </div>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard
