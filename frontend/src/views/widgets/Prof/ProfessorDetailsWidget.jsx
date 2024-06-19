/* eslint-disable react/no-unescaped-entities */
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import {
  CCol,
  CRow,
  CProgress,
  CProgressBar,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CButton,
} from '@coreui/react'
import { useAuth } from 'react-oidc-context'
import { getUsers } from '../../../Actions/UserActions/getUsers'
import QueryBuilderIcon from '@mui/icons-material/QueryBuilder'

const daysOfWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
const progressColors = ['primary', 'secondary', 'success', 'danger', 'warning', 'info']

const ProfessorDetailsWidget = ({ getseance, getStudentData }) => {
  const auth = useAuth()
  const username = auth?.user?.profile?.name
  const role = auth?.user?.profile?.userRole

  const [currentWeekData, setCurrentWeekData] = useState(
    Array(6).fill({ hours: 0, absencePercentage: 0 }),
  )
  const [professors, setProfessors] = useState([])
  const [selectedProfessor, setSelectedProfessor] = useState(role === 'Enseignant' ? username : '')

  useEffect(() => {
    if (role === 'Admin') {
      fetchProfessors()
    }
    fetchData()
  }, [getseance, getStudentData, selectedProfessor, role])

  const fetchProfessors = async () => {
    try {
      const users = await getUsers()
      const professors = users.filter((user) => user.roleName === 'Enseignant')
      setProfessors(professors)
    } catch (error) {
      console.error('Error fetching professors:', error)
    }
  }

  const fetchData = async () => {
    try {
      const seancesData = await getseance()
      if (seancesData) {
        const filteredSeances = seancesData.filter(
          (seance) => seance.nomProfesseur === selectedProfessor,
        )
        if (getStudentData) {
          const studentsData = await getStudentData()
          const currentWeekData = getCurrentWeekData(filteredSeances, studentsData)
          setCurrentWeekData(currentWeekData)
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const getCurrentWeekData = (seances, studentsData) => {
    const weekData = Array(6)
      .fill()
      .map(() => ({ hours: 0, totalStudents: 0, totalAbsent: 0 }))

    const today = new Date()
    const startOfWeek = new Date(today)
    startOfWeek.setDate(startOfWeek.getDate() - (today.getDay() === 0 ? 6 : today.getDay() - 1))
    startOfWeek.setHours(0, 0, 0, 0)

    seances.forEach((seance) => {
      const seanceDate = new Date(seance.dateSéance)
      const seanceStartTime = new Date(`${seance.dateSéance}T${seance.heureDébut}`)
      const seanceEndTime = new Date(`${seance.dateSéance}T${seance.heureFin}`)
      const seanceDuration = (seanceEndTime - seanceStartTime) / (1000 * 60 * 60)

      const seanceGroupeId = seance.groupeId
      const studentsInGroup = studentsData.filter((student) => student.idGroupe === seanceGroupeId)
      const totalStudentsInGroup = studentsInGroup.length
      const absentStudents = seance.étudiantsAbsents.filter((absentId) =>
        studentsInGroup.some((student) => student.etudiantId === absentId),
      )
      const absentCount = absentStudents.length

      for (let i = 0; i < 6; i++) {
        const day = new Date(startOfWeek)
        day.setDate(day.getDate() + i)
        day.setHours(0, 0, 0, 0)

        if (
          seanceDate.getDate() === day.getDate() &&
          seanceDate.getMonth() === day.getMonth() &&
          seanceDate.getFullYear() === day.getFullYear()
        ) {
          weekData[i].hours += seanceDuration
          weekData[i].totalStudents += totalStudentsInGroup
          weekData[i].totalAbsent += absentCount
        }
      }
    })
    return weekData.map((dayData) => {
      const absencePercentage =
        dayData.totalStudents > 0 ? (dayData.totalAbsent / dayData.totalStudents) * 100 : 0
      return {
        hours: dayData.hours,
        absencePercentage,
      }
    })
  }

  return (
    <CCol md={12}>
      <CRow>
        <CCol>
          {role === 'Admin' && (
            <div className="mb-3 text-end">
              <CDropdown alignment="end">
                <CButton style={{ backgroundColor: '#3AA6B9', color: 'white' }} size="sm">
                  {selectedProfessor ? selectedProfessor : 'Choisir un professeur'}
                </CButton>
                <CDropdownToggle
                  style={{ backgroundColor: '#3AA6B9', color: 'white' }}
                  size="sm"
                  split
                />
                <CDropdownMenu>
                  {professors
                    .filter((prof) => prof.fullName !== username)
                    .map((prof) => (
                      <CDropdownItem
                        key={prof.id}
                        onClick={() => setSelectedProfessor(prof.fullName)}
                      >
                        {prof.fullName}
                      </CDropdownItem>
                    ))}
                </CDropdownMenu>
              </CDropdown>
            </div>
          )}
          {currentWeekData.map((dayData, index) => (
            <div key={index} className="mb-2">
              <hr className="mt-0" />
              <div className="progress-group">
                <div className="progress-group-prepend">
                  <span className="text-body-secondary fw-bold">{daysOfWeek[index]}</span>
                </div>
                <div
                  style={{
                    transition: 'transform 0.3s ease-in-out',
                    marginBottom: '20px',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  className="progress-group-bars"
                >
                  <div className="text-body-secondary d-flex justify-content-between mb-2 small fw-bold">
                    <div className="text-start small">Heures effectuées</div>
                    <div className="text-end small">
                      {dayData.hours.toFixed(2)} <QueryBuilderIcon fontSize="small" />
                    </div>
                  </div>
                  <CProgress
                    color={progressColors[index]}
                    variant="striped"
                    animated
                    value={(dayData.hours / 8) * 100}
                  />

                  <div className="text-body-secondary d-flex justify-content-between mt-2 small fw-bold">
                    <div className="text-start small">Pourcentage d'absence</div>
                    <div className="text-end small">{dayData.absencePercentage.toFixed(2)}%</div>
                  </div>
                  <CProgress
                    color={progressColors[index]}
                    variant="striped"
                    animated
                    value={dayData.absencePercentage}
                  >
                    <CProgressBar value={dayData.absencePercentage} />
                  </CProgress>
                </div>
              </div>
            </div>
          ))}
        </CCol>
      </CRow>
    </CCol>
  )
}

ProfessorDetailsWidget.propTypes = {
  getseance: PropTypes.func.isRequired,
  getStudentData: PropTypes.func,
}

export default ProfessorDetailsWidget
