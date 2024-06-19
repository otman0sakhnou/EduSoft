/* eslint-disable react/no-unescaped-entities */
import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CTable,
  CTableHead,
  CTableBody,
  CRow,
  CCol,
  CCardHeader,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CSpinner,
} from '@coreui/react'
import { addSession } from '../../Actions/BackOfficeActions/SéanceActions'
import { getGroupes } from '../../Actions/BackOfficeActions/GroupeActions'
import { getModules } from '../../Actions/BackOfficeActions/ModuleActions'
import { MenuItem, Select, TextField } from '@mui/material'
import { getStudents } from '../../Actions/BackOfficeActions/ÉtudiantActions'
import FilterListIcon from '@mui/icons-material/FilterList'
import EmptyFilter from '../../components/EmptyFilters'
import { toast } from 'react-hot-toast'
import { useAuth } from 'react-oidc-context'
export default function Component() {
  const [selectedGroup, setSelectedGroup] = useState('')
  const [selectedGroupId, setSelectedGroupId] = useState('')
  const [selectedGroupError, setSelectedGroupError] = useState('')
  const [students, setStudents] = useState([])
  const [absentStudents, setAbsentStudents] = useState([])
  const [date, setDate] = useState('')
  const [dateError, setDateError] = useState('')
  const [startTime, setStartTime] = useState('')
  const [startTimeError, setStartTimeError] = useState('')
  const [endTime, setEndTime] = useState('')
  const [endTimeError, setEndTimeError] = useState('')
  const [groupes, setGroupes] = useState([])
  const [modules, setModules] = useState([])
  const [selectedModule, setSelectedModule] = useState('')
  const [selectedModuleError, setSelectedModuleError] = useState('')
  const [selectedFiliere, setSelectedFiliere] = useState('')
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const auth = useAuth()
  const accessToken = auth?.user?.access_token
  const resetForm = () => {
    setSelectedGroup('')
    setSelectedGroupId('')
    setSelectedGroupError('')
    setStudents([])
    setAbsentStudents([])
    setDate('')
    setDateError('')
    setStartTime('')
    setStartTimeError('')
    setEndTime('')
    setEndTimeError('')
    setSelectedModule('')
    setSelectedModuleError('')
    setSelectedFiliere('')
  }
  useEffect(() => {
    fetchGroupes()
    fetchModules()
    fetchStudents()
  }, [])
  const fetchGroupes = async () => {
    try {
      const data = await getGroupes()
      setGroupes(data)
    } catch (error) {
      console.error('Error fetching groupes:', error)
    }
  }
  const fetchModules = async () => {
    try {
      const data = await getModules()
      setModules(data)
    } catch (error) {
      console.error('Error fetching modules:', error)
    }
  }
  const fetchStudents = async () => {
    try {
      const data = await getStudents()
      setStudents(data)
    } catch (error) {
      console.error('Error fetching students:', error)
    }
  }
  const handleGroupChange = async (event) => {
    const selectedGroup = event.target.value
    setSelectedGroup(selectedGroup)
    const group = groupes.find((groupe) => groupe.nomGroupe === selectedGroup)
    if (group) {
      setSelectedGroupId(group.groupeID)
      setSelectedFiliere(group.nomFilière)
    }
  }

  const handleModuleChange = (event) => {
    setSelectedModule(event.target.value)
  }
  const handleAbsentChange = (studentId) => {
    const absentIndex = absentStudents.findIndex((absentStudentId) => absentStudentId === studentId)
    if (absentIndex === -1) {
      setAbsentStudents([...absentStudents, studentId])
    } else {
      const updatedAbsentStudents = [...absentStudents]
      updatedAbsentStudents.splice(absentIndex, 1)
      setAbsentStudents(updatedAbsentStudents)
    }
  }
  const handleSignaler = () => {
    let hasError = false
    if (!selectedGroup) {
      setSelectedGroupError(true)
      hasError = true
    }
    if (!selectedModule) {
      setSelectedModuleError(true)
      hasError = true
    }
    if (!date) {
      setDateError(true)
      hasError = true
    }
    if (!startTime) {
      setStartTimeError(true)
      hasError = true
    }
    if (!endTime) {
      setEndTimeError(true)
      hasError = true
    }
    if (hasError) return
    setShowConfirmationModal(true)
  }
  const confirmSignaler = async () => {
    try {
      setLoading(true)
      await addSession(
        {
          GroupeId: selectedGroupId,
          ModuleId: selectedModule,
          DateSéance: date,
          HeureDébut: startTime,
          HeureFin: endTime,
          ÉtudiantsAbsents: absentStudents,
        },
        accessToken,
      ),
        setAbsentStudents([])
      toast.success("Signalement d'absence avec succèss")
      resetForm()
      setLoading(false)
      setShowConfirmationModal(false)
    } catch (error) {
      console.error('Error signaling absence or adding session:', error)
      toast.error("Signalement d'absence échoué")
      setShowConfirmationModal(false)
    }
  }
  const filteredStudents = students.filter((student) => student.nomGroupe === selectedGroup)
  return (
    <div className="container mx-auto my-8 px-4 sm:px-6 lg:px-8">
      <CCard
        style={{
          maxWidth: '100%',
          borderRadius: '12px',
          transition: 'transform 0.3s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-5px)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
      >
        <CCardBody>
          <CCardHeader
            className="mb-3"
            style={{
              fontSize: '1.25rem',
              fontWeight: 'bold',
              padding: '0.75rem 1.25rem',
              borderBottom: '1px solid #dee2e6',
              borderRadius: '12px 12px 0 0',
            }}
          >
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 my-3">
              Signaler l'absence
            </h2>
          </CCardHeader>
          <form className="space-y-6">
            <CRow>
              <CCol>
                <div className="mb-4">
                  <label htmlFor="group" className="form-label">
                    Groupe enseigné
                  </label>
                  <Select
                    value={selectedGroup}
                    displayEmpty
                    fullWidth
                    isSearchable={true}
                    error={selectedGroupError}
                    helperText={selectedGroupError && 'Vous devez sélectionner un groupe'}
                    placeholder="Sélectionner le groupe"
                    onChange={(event) => {
                      handleGroupChange(event)
                      setSelectedGroupError(false)
                    }}
                  >
                    <MenuItem value="" disabled>
                      Sélectionner le groupe
                    </MenuItem>
                    {groupes.map((groupe) => (
                      <MenuItem key={groupe.groupeID} value={groupe.nomGroupe}>
                        {groupe.nomGroupe}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
              </CCol>
              <CCol>
                <div className="mb-4">
                  <label htmlFor="module" className="form-label">
                    Module enseigné
                  </label>
                  <Select
                    displayEmpty
                    fullWidth
                    value={selectedModule}
                    error={selectedModuleError}
                    helperText={selectedModuleError && 'Vous devez sélectionner un module'}
                    margin="dense"
                    onChange={(e) => {
                      handleModuleChange(e)
                      setSelectedModuleError(false)
                    }}
                    variant="outlined"
                  >
                    <MenuItem value="" disabled>
                      Sélectionner le module
                    </MenuItem>
                    {modules
                      .filter((module) =>
                        module.filières.some((f) => f.nomFilière === selectedFiliere),
                      )
                      .map((module) => (
                        <MenuItem key={module.moduleId} value={module.moduleId}>
                          {module.nomModule}
                        </MenuItem>
                      ))}
                  </Select>
                </div>
              </CCol>
            </CRow>
            <CRow className="g-3">
              <CCol md={6}>
                <div className="mb-4">
                  <label htmlFor="date" className="form-label">
                    Date de séance
                  </label>
                  <TextField
                    type="date"
                    className="form-control"
                    value={date}
                    error={dateError}
                    helperText={dateError && 'Vous devez saisir une date'}
                    onChange={(e) => {
                      setDate(e.target.value)
                      setDateError(false)
                    }}
                  />
                </div>
              </CCol>
              <CCol>
                <div className="mb-4">
                  <label htmlFor="time" className="form-label">
                    Début de séance
                  </label>
                  <TextField
                    type="time"
                    className="form-control"
                    value={startTime}
                    error={startTimeError}
                    helperText={startTimeError && 'Vous devez saisir une heure de début'}
                    onChange={(e) => {
                      setStartTime(e.target.value)
                      setStartTimeError(false)
                    }}
                  />
                </div>
              </CCol>
              <CCol>
                <div className="mb-4">
                  <label htmlFor="time" className="form-label">
                    Fin de séance
                  </label>
                  <TextField
                    type="time"
                    className="form-control"
                    value={endTime}
                    error={endTimeError}
                    helperText={endTimeError && 'Vous devez saisir une heure de fin'}
                    onChange={(e) => {
                      setEndTime(e.target.value)
                      setEndTimeError(false)
                    }}
                  />
                </div>
              </CCol>
            </CRow>
            {selectedGroup ? (
              <>
                <CRow>
                  <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 my-3">
                    La List des Étudiants
                  </h2>
                </CRow>
                <div className="mb-4">
                  <CTable align="middle" className="mb-0 border" hover responsive>
                    <CTableHead>
                      <tr>
                        <th
                          style={{ backgroundColor: '#57A6A1', color: 'white', fontWeight: 'bold' }}
                        >
                          <FilterListIcon />
                        </th>
                        <th
                          style={{ backgroundColor: '#57A6A1', color: 'white', fontWeight: 'bold' }}
                          scope="col"
                        >
                          CNE
                        </th>
                        <th
                          style={{ backgroundColor: '#57A6A1', color: 'white', fontWeight: 'bold' }}
                          scope="col"
                        >
                          Nom complet
                        </th>
                        <th
                          style={{ backgroundColor: '#57A6A1', color: 'white', fontWeight: 'bold' }}
                          scope="col"
                        >
                          Absent(e)
                        </th>
                      </tr>
                    </CTableHead>
                    <CTableBody>
                      {filteredStudents.map((student, index) => (
                        <tr key={index}>
                          <td style={{ fontWeight: 'bold' }}>{index + 1}</td>
                          <td style={{ fontWeight: 'bold' }}>{student.cne}</td>
                          <td style={{ fontWeight: 'bold' }}>
                            {student.nom} {student.prenom}
                          </td>
                          <td style={{ fontWeight: 'bold' }}>
                            <input
                              type="checkbox"
                              id={`absent-${index}`}
                              onChange={() => handleAbsentChange(student.etudiantId)}
                            />
                          </td>
                        </tr>
                      ))}
                    </CTableBody>
                  </CTable>
                </div>
              </>
            ) : (
              <div className="text-center">
                <EmptyFilter
                  title="Sélectionner un groupe"
                  subtitle="Vous devez sélectionner un groupe pour afficher les étudiants"
                />
              </div>
            )}
            <CRow>
              <CCol className="text-end">
                <CButton
                  className="btn"
                  color="info"
                  shape="rounded-pill"
                  style={{
                    marginTop: '10px',
                    padding: '10px 30px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: '#ffffff',
                    cursor: 'pointer',
                  }}
                  onClick={handleSignaler}
                >
                  Signaler
                </CButton>
              </CCol>
            </CRow>
          </form>
        </CCardBody>
      </CCard>
      <CModal
        visible={showConfirmationModal}
        onClose={() => setShowConfirmationModal(false)}
        size="md"
      >
        <CModalHeader closeButton>
          <CModalTitle>Confirmation</CModalTitle>
        </CModalHeader>
        <CModalBody>Vous Êtes sûr de signaler ces absences ?</CModalBody>
        <CModalFooter>
          <CButton
            shape="rounded-pill"
            style={{
              marginTop: '10px',
              padding: '10px 30px',
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#ffffff',
              backgroundColor: '#007bff',
              cursor: 'pointer',
            }}
            disabled={loading}
            onClick={confirmSignaler}
          >
            {loading ? (
              <CSpinner as="span" size="sm" variant="grow" aria-hidden="true" />
            ) : (
              'Signaler'
            )}
          </CButton>
          <CButton
            shape="rounded-pill"
            style={{
              marginTop: '10px',
              marginLeft: '10px',
              padding: '10px 20px',
              fontSize: '16px',
              fontWeight: 'bold',
              border: '2px solid #dc3545',
              color: '#dc3545',
              cursor: 'pointer',
            }}
            onClick={() => setShowConfirmationModal(false)}
          >
            Annuler
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}
