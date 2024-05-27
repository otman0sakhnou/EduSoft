/* eslint-disable react/no-unescaped-entities */
import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CCol,
  CTable,
  CTableHead,
  CTableBody,
  CTableHeaderCell,
  CTableRow,
  CTableDataCell,
  CTableCaption,
  CFormInput,
  CButton,
  CCardFooter,
} from '@coreui/react'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import chroma from 'chroma-js'
import { getGroupes } from '../../Actions/BackOfficeActions/GroupeActions'
import { getStudents } from '../../Actions/BackOfficeActions/ÉtudiantActions'
import { getModuleById } from '../../Actions/BackOfficeActions/ModuleActions'
import {
  getTopModulesWithMostAbsences,
  getMonthlyAbsencesCount,
  getAbsenceCounts,
  getLastAbsence,
  getSessionsByEtudiant,
} from '../../Actions/BackOfficeActions/SéanceActions'
import { CChart } from '@coreui/react-chartjs'
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined'
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined'
import IconButton from '@mui/material/IconButton'
import Collapse from '@mui/material/Collapse'
import { Typography, Box } from '@mui/material'
import EmptyFilter from '../../components/EmptyFilters'
import { getStyle } from '@coreui/utils'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'

const animatedComponents = makeAnimated()

export default function ReviewAbsence() {
  const [groupes, setGroupes] = useState([])
  const [selectedGroups, setSelectedGroups] = useState([])
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [students, setStudents] = useState([])
  const [absentCount, setAbsentCount] = useState({})
  const [searchText, setSearchText] = useState('')
  const [topModules, setTopModules] = useState({})
  const [monthlyAbsences, setMonthlyAbsences] = useState({})
  const [groupIDToName, setGroupIDToName] = useState({})
  const [lastAbsenceDates, setLastAbsenceDates] = useState({})
  const [openStudentId, setOpenStudentId] = useState(null)
  const [sessionRows, setSessionRows] = useState({})
  const [selectedPeriod, setSelectedPeriod] = useState('ThisWeek')
  const [sortOrder, setSortOrder] = useState('asc')

  useEffect(() => {
    fetchGroupes()
  }, [])

  useEffect(() => {
    if (selectedGroups.length > 0) {
      fetchTopModules()
      fetchMonthlyAbsences()
    }
  }, [selectedGroups])

  useEffect(() => {
    if (selectedGroup) {
      fetchStudents()
    }
  }, [selectedGroup])

  const fetchGroupes = async () => {
    try {
      const data = await getGroupes()
      setGroupes(data)
      const groupMapping = data.reduce((acc, groupe) => {
        acc[groupe.groupeID] = groupe.nomGroupe
        return acc
      }, {})
      setGroupIDToName(groupMapping)
    } catch (error) {
      console.error('Error fetching groupes:', error)
    }
  }
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
  }
  const fetchStudents = async () => {
    try {
      const data = await getStudents()
      const filteredStudents = data.filter((student) => student.nomGroupe === selectedGroup.value)
      setStudents(filteredStudents)

      const lastAbsenceData = await Promise.all(
        filteredStudents.map((student) => getLastAbsence(student.etudiantId)),
      )

      const absenceCounts = await Promise.all(
        filteredStudents.map((student) => getAbsenceCounts(student.etudiantId)),
      )

      const absenceCountMap = filteredStudents.reduce((acc, student, index) => {
        acc[student.etudiantId] = absenceCounts[index] || {}
        return acc
      }, {})

      setAbsentCount(absenceCountMap)

      const lastAbsenceDatesMap = filteredStudents.reduce((acc, student, index) => {
        acc[student.etudiantId] = lastAbsenceData[index] || {}
        return acc
      }, {})

      setLastAbsenceDates(lastAbsenceDatesMap)
    } catch (error) {
      console.error('Error fetching students:', error)
    }
  }
  const fetchTopModules = async () => {
    try {
      const topModulesData = await Promise.all(
        selectedGroups.map((groupID) => getTopModulesWithMostAbsences(groupID)),
      )
      const formattedData = {}
      selectedGroups.forEach((groupID, index) => {
        formattedData[groupID] = topModulesData[index]
      })
      setTopModules(formattedData)
    } catch (error) {
      console.error('Error fetching top modules:', error)
    }
  }

  const fetchMonthlyAbsences = async () => {
    try {
      const monthlyAbsencesData = await Promise.all(
        selectedGroups.map((groupID) => getMonthlyAbsencesCount(groupID)),
      )
      const formattedData = {}
      selectedGroups.forEach((groupID, index) => {
        const groupAbsences = Array.from({ length: 31 }, (_, i) => {
          const dayData = monthlyAbsencesData[index].find((item) => item.day === i + 1)
          return dayData ? dayData.absenceCount : 0
        })
        formattedData[groupID] = groupAbsences
      })
      setMonthlyAbsences(formattedData)
    } catch (error) {
      console.error('Error fetching monthly absences:', error)
    }
  }

  const columns = [
    { field: 'nomModule', headerName: 'Nom de Module', width: 150 },
    { field: 'dateSeance', headerName: 'Date de Séance', width: 150 },
    { field: 'heureDebut', headerName: 'Heure de Début', width: 150 },
  ]

  const getSeanceRows = async (id) => {
    try {
      const seanceData = await getSessionsByEtudiant(id)
      const seanceRows = await Promise.all(
        seanceData.map(async (seance) => {
          const module = await getModuleById(seance.moduleId)
          return {
            dateSeance: seance.dateSéance,
            heureDebut: seance.heureDébut,
            nomModule: module ? module.nomModule : 'Module Inconnu',
          }
        }),
      )

      return seanceRows
    } catch (error) {
      console.error('Error fetching seance data:', error)
      return []
    }
  }
  const handleGroupChange = (selectedOptions) => {
    setSelectedGroups(selectedOptions.map((option) => option.value))
  }

  const generateColors = (numColors) => {
    const colors = []
    for (let i = 0; i < numColors; i++) {
      const color = chroma.random().hex()
      colors.push(color)
    }
    return colors
  }

  const colors = generateColors(selectedGroups.length)

  const allModuleNames = Array.from(
    new Set(
      selectedGroups.flatMap(
        (groupID) => topModules[groupID]?.map((module) => module.moduleName) || [],
      ),
    ),
  )

  const filteredStudents = students.filter((student) => {
    const fullName = `${student.nom} ${student.prenom}`.toLowerCase()
    return fullName.includes(searchText.toLowerCase())
  })

  const handleGroupChange2 = (selectedOption) => {
    setSelectedGroup(selectedOption)
  }

  const handleSearchChange = (event) => {
    setSearchText(event.target.value)
  }

  const handleStudentClick = async (student) => {
    const studentId = student.etudiantId
    if (openStudentId === studentId) {
      setOpenStudentId(null)
    } else {
      if (!sessionRows[studentId]) {
        const rows = await getSeanceRows(studentId)
        setSessionRows((prev) => ({ ...prev, [studentId]: rows }))
      }
      setOpenStudentId(studentId)
    }
  }
  const getAbsenceDataForChart = (studentId) => {
    const periodKey = selectedPeriod
    const student = students.find((student) => student.etudiantId === studentId)

    if (!student || typeof absentCount !== 'object') {
      return {
        labels: [],
        datasets: [],
      }
    }

    const absences = absentCount[student.etudiantId]
    if (!absences || !absences[periodKey]) {
      return {
        labels: [],
        datasets: [],
      }
    }

    const data = Object.entries(absences[periodKey]).map(([module, count]) => ({
      module,
      count,
    }))

    return {
      labels: data.map((item) => item.module),
      datasets: [
        {
          label: 'Absences',
          data: data.map((item) => item.count),
          backgroundColor: generateColors(data.length),
        },
      ],
    }
  }
  const handlePeriodChange = (selectedOption) => {
    if (typeof selectedOption === 'object') {
      setSelectedPeriod(selectedOption.value)
    }
  }

  const periodOptions = [
    { value: 'ThisWeek', label: 'Cette semaine' },
    { value: 'ThisMonth', label: 'Ce mois-ci' },
    { value: 'ThisYear', label: 'Cette année' },
  ]

  return (
    <>
      <CCard className="p-5 mb-5 shadow-lg">
        <CCardHeader
          style={{
            fontSize: '1.25rem',
            fontWeight: 'bold',
            color: '#343a40',
            backgroundColor: '#e9ecef',
            padding: '0.75rem 1.25rem',
            borderBottom: '1px solid #dee2e6',
            borderRadius: '12px 12px 0 0',
          }}
        >
          <h2
            style={{
              fontWeight: 'bold',
              color: '#343a40',
            }}
            className="mb-2 mx-2"
          >
            {' '}
            Aperçu des absences par groupe
          </h2>
        </CCardHeader>
        <CCardBody>
          <CRow className="mb-4">
            <CCol>
              <Select
                closeMenuOnSelect={false}
                components={animatedComponents}
                isMulti
                placeholder="Sélectionner un groupe"
                options={groupes.map((groupe) => ({
                  value: groupe.groupeID,
                  label: groupe.nomGroupe,
                }))}
                onChange={handleGroupChange}
              />
            </CCol>
          </CRow>
          {selectedGroups.length > 0 ? (
            <CRow className="mb-4">
              <CCol>
                <div
                  style={{
                    backgroundColor: '#f8f9fa',
                    color: '#495057',
                    padding: '10px',
                    borderRadius: '5px',
                    border: '1px solid #ced4da',
                    marginBottom: '15px',
                    fontWeight: 'bold',
                  }}
                >
                  Le diagramme initial permet d'illustrer les modules qui ont le plus grand
                  pourcentage d'absence pour chaque ensemble.
                </div>
              </CCol>
              <CCol
                style={{
                  transition: 'transform 0.3s ease-in-out',
                  marginBottom: '20px',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                md={12}
              >
                <CChart
                  style={{ borderRadius: '12px' }}
                  type="bar"
                  data={{
                    labels: allModuleNames,
                    datasets: selectedGroups.map((groupID, index) => ({
                      label: groupIDToName[groupID],
                      backgroundColor: colors[index],
                      data: allModuleNames.map((moduleName) => {
                        const module = topModules[groupID]?.find((m) => m.moduleName === moduleName)
                        return module ? module.absenceCount : 0
                      }),
                    })),
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'top',
                      },
                    },
                    scales: {
                      x: {
                        grid: {
                          color: getStyle('--cui-border-color-translucent'),
                        },
                        ticks: {
                          color: getStyle('--cui-body-color'),
                        },
                      },
                      y: {
                        grid: {
                          color: getStyle('--cui-border-color-translucent'),
                        },
                        ticks: {
                          color: getStyle('--cui-body-color'),
                        },
                      },
                    },
                  }}
                />
              </CCol>
              <CCol>
                <div
                  style={{
                    backgroundColor: '#f8f9fa',
                    color: '#495057',
                    padding: '10px',
                    borderRadius: '5px',
                    border: '1px solid #ced4da',
                    marginBottom: '15px',
                    fontWeight: 'bold',
                  }}
                >
                  Le deuxième diagramme permet d'afficher le total des absences pour chaque groupe
                  pendant le mois actuel
                </div>
              </CCol>
              <CCol
                style={{
                  transition: 'transform 0.3s ease-in-out',
                  marginBottom: '20px',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                md={12}
              >
                <CChart
                  style={{ borderRadius: '12px' }}
                  type="line"
                  data={{
                    labels: Array.from({ length: 31 }, (_, i) => i + 1),
                    datasets: selectedGroups.map((groupID, index) => ({
                      label: groupIDToName[groupID],
                      borderColor: colors[index],
                      backgroundColor: colors[index],
                      fill: false,
                      data: monthlyAbsences[groupID] || [],
                    })),
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'top',
                      },
                    },
                    scales: {
                      x: {
                        grid: {
                          color: getStyle('--cui-border-color-translucent'),
                        },
                        ticks: {
                          color: getStyle('--cui-body-color'),
                        },
                      },
                      y: {
                        grid: {
                          color: getStyle('--cui-border-color-translucent'),
                        },
                        ticks: {
                          color: getStyle('--cui-body-color'),
                        },
                      },
                    },
                  }}
                />
              </CCol>
            </CRow>
          ) : (
            <div className="text-center">
              <EmptyFilter
                title="Aucun groupe sélectionner"
                subtitle="Vous devez sélectionner au moins un groupe pour afficher ces statisques "
              />
            </div>
          )}
        </CCardBody>
      </CCard>
      <CCard className="p-5 shadow-lg">
        <CCardHeader
          backgroundColor=" dark"
          style={{
            backgroundColor: '#e9ecef',
            padding: '0.75rem 1.25rem',
            borderBottom: '1px solid #dee2e6',
            borderRadius: '12px 12px 0 0',
          }}
        >
          <h2
            style={{
              fontWeight: 'bold',
              color: '#343a40',
            }}
            className="mb-2 mx-2"
          >
            Aperçu des absences par étudiant
          </h2>
        </CCardHeader>
        <CCardBody>
          <CRow className="mb-4">
            <CCol md={6}>
              <Select
                components={animatedComponents}
                placeholder="Sélectionner un groupe"
                isClearable={true}
                options={groupes.map((groupe) => ({
                  value: groupe.nomGroupe,
                  label: groupe.nomGroupe,
                }))}
                onChange={handleGroupChange2}
              />
            </CCol>
            <CCol md={6}>
              <CFormInput
                disabled={selectedGroup == null}
                type="text"
                placeholder="Rechercher un étudiant"
                value={searchText}
                onChange={handleSearchChange}
              />
            </CCol>
          </CRow>
          {selectedGroup ? (
            <CRow>
              <CCol>
                <CTable align="middle" className="mb-0 border" hover responsive>
                  <CTableCaption>Liste des étudiants</CTableCaption>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell
                        style={{ backgroundColor: '#57A6A1', color: 'white', fontWeight: 'bold' }}
                        scope="col"
                      >
                        Nom complet
                      </CTableHeaderCell>
                      <CTableHeaderCell
                        style={{ backgroundColor: '#57A6A1', color: 'white', fontWeight: 'bold' }}
                        scope="col"
                      >
                        Télephone
                      </CTableHeaderCell>
                      <CTableHeaderCell
                        style={{ backgroundColor: '#57A6A1', color: 'white', fontWeight: 'bold' }}
                        scope="col"
                      >
                        Dernière Absence
                      </CTableHeaderCell>
                      <CTableHeaderCell
                        style={{ backgroundColor: '#57A6A1', color: 'white', fontWeight: 'bold' }}
                        scope="col"
                      >
                        Détails
                      </CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {filteredStudents.map((student) => (
                      <React.Fragment key={student.etudiantId}>
                        <CTableRow>
                          <CTableDataCell>
                            {student.nom} {student.prenom}
                          </CTableDataCell>
                          <CTableDataCell>{student.telephone}</CTableDataCell>
                          <CTableDataCell>
                            {lastAbsenceDates[student.etudiantId]?.message ||
                              lastAbsenceDates[student.etudiantId]}
                          </CTableDataCell>
                          <CTableDataCell>
                            <IconButton
                              aria-label="expand row"
                              size="small"
                              onClick={() => handleStudentClick(student)}
                            >
                              {openStudentId === student.etudiantId ? (
                                <KeyboardArrowUpOutlinedIcon
                                  style={{
                                    borderRadius: '50%',
                                    color: '#FFFFFF',
                                    background: '#57A6A1',
                                  }}
                                />
                              ) : (
                                <KeyboardArrowDownOutlinedIcon
                                  style={{
                                    borderRadius: '50%',
                                    color: '#FFFFFF',
                                    background: '#57A6A1',
                                  }}
                                />
                              )}
                            </IconButton>
                          </CTableDataCell>
                        </CTableRow>
                        <CTableRow>
                          <CTableDataCell colSpan={6}>
                            <Collapse
                              in={openStudentId === student.etudiantId}
                              timeout="auto"
                              unmountOnExit
                            >
                              <Box margin={4}>
                                <Typography
                                  variant="h6"
                                  gutterBottom
                                  style={{ fontWeight: 'bold' }}
                                  component="div"
                                >
                                  Le nombres des absences
                                </Typography>
                                <CCardHeader>
                                  <CRow>
                                    <CCol>
                                      <label htmlFor="periodSelect">Choisir la période :</label>
                                    </CCol>
                                    <CCol md={8}>
                                      <div className="d-flex flex-wrap">
                                        <div className="d-flex">
                                          {periodOptions.map((option) => (
                                            <CButton
                                              key={option.value}
                                              onClick={() => handlePeriodChange(option)}
                                              size="sm"
                                              shape="rounded-pill"
                                              style={{
                                                marginRight: '2px',
                                                padding: '5px 20px',
                                                fontWeight: 'bold',
                                                cursor: 'pointer',
                                                color: 'white',
                                                backgroundColor:
                                                  option.value === selectedPeriod
                                                    ? '#007BFF'
                                                    : '#4CCD99',
                                              }}
                                            >
                                              {option.label}
                                            </CButton>
                                          ))}
                                        </div>
                                      </div>
                                    </CCol>
                                  </CRow>
                                </CCardHeader>
                                <CCardBody className="row justify-content-md-center">
                                  <CCol
                                    style={{
                                      transition: 'transform 0.3s ease-in-out',
                                      marginBottom: '20px',
                                    }}
                                    onMouseEnter={(e) =>
                                      (e.currentTarget.style.transform = 'scale(1.05)')
                                    }
                                    onMouseLeave={(e) =>
                                      (e.currentTarget.style.transform = 'scale(1)')
                                    }
                                    lg={5}
                                  >
                                    <CChart
                                      type="doughnut"
                                      data={getAbsenceDataForChart(student.etudiantId)}
                                      options={{
                                        plugins: {
                                          legend: {
                                            labels: {
                                              color: getStyle('--cui-body-color'),
                                            },
                                          },
                                        },
                                      }}
                                    />
                                  </CCol>
                                </CCardBody>
                                <Typography
                                  variant="h6"
                                  className="font-bold"
                                  gutterBottom
                                  component="div"
                                  style={{ fontWeight: 'bold', marginTop: '10px' }}
                                >
                                  Détails des séances
                                </Typography>
                                <CTable size="small" className="mb-0 border" responsive hover>
                                  <CTableHead>
                                    <CTableRow>
                                      <CTableHeaderCell
                                        style={{
                                          backgroundColor: '#57A6A1',
                                          color: 'white',
                                          fontWeight: 'bold',
                                        }}
                                      >
                                        Nom de module
                                      </CTableHeaderCell>
                                      <CTableHeaderCell
                                        style={{
                                          backgroundColor: '#57A6A1',
                                          color: 'white',
                                          fontWeight: 'bold',
                                        }}
                                        onClick={toggleSortOrder}
                                      >
                                        <IconButton
                                          className="text-white"
                                          size="small"
                                          onClick={toggleSortOrder}
                                          aria-label="sort"
                                        >
                                          {sortOrder === 'asc' ? (
                                            <ArrowUpwardIcon />
                                          ) : (
                                            <ArrowDownwardIcon />
                                          )}
                                        </IconButton>
                                        Date de séance
                                      </CTableHeaderCell>
                                      <CTableHeaderCell
                                        style={{
                                          backgroundColor: '#57A6A1',
                                          color: 'white',
                                          fontWeight: 'bold',
                                        }}
                                      >
                                        Heure de début{' '}
                                      </CTableHeaderCell>
                                    </CTableRow>
                                  </CTableHead>
                                  <CTableBody>
                                    {(sessionRows[student.etudiantId] || [])
                                      .sort((a, b) => {
                                        const dateA = new Date(a.dateSeance)
                                        const dateB = new Date(b.dateSeance)
                                        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA
                                      })
                                      .map((row, index) => (
                                        <CTableRow key={index}>
                                          <CTableDataCell>{row.nomModule}</CTableDataCell>
                                          <CTableDataCell>{row.dateSeance}</CTableDataCell>
                                          <CTableDataCell>{row.heureDebut}</CTableDataCell>
                                        </CTableRow>
                                      ))}
                                    {sessionRows[student.etudiantId]?.length === 0 && (
                                      <CTableRow>
                                        <CTableDataCell colSpan={columns.length}>
                                          Aucune absence enregistrée pour cet étudiant
                                        </CTableDataCell>
                                      </CTableRow>
                                    )}
                                  </CTableBody>
                                </CTable>
                              </Box>
                            </Collapse>
                          </CTableDataCell>
                        </CTableRow>
                      </React.Fragment>
                    ))}
                  </CTableBody>
                </CTable>
              </CCol>
            </CRow>
          ) : (
            <div className="text-center">
              <EmptyFilter
                title="Aucun groupe sélectionner"
                subtitle="vous devez sélectionner un groupe pour afficher les étudiants"
              />
            </div>
          )}
        </CCardBody>
      </CCard>
    </>
  )
}
