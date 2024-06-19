/* eslint-disable react/no-unescaped-entities */
import React, { useState, useEffect } from 'react'
import { CCard, CCardBody, CCardHeader, CCardTitle, CRow, CCol, CButton } from '@coreui/react'
import { TextField } from '@mui/material'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import { getHoursWorked } from '../../Actions/BackOfficeActions/SéanceActions'
import { getUsers } from '../../Actions/UserActions/getUsers'
import QueryBuilderIcon from '@mui/icons-material/QueryBuilder'
import AddFacture from './AddFacture'

export default function Component() {
  const [professorName, setProfessorName] = useState('')
  const [date, setDate] = useState('')
  const [schedule, setSchedule] = useState([])
  const [dateError, setDateError] = useState(false)
  const [nameError, setNameError] = useState(false)
  const [professors, setProfessors] = useState([])

  const animatedComponents = makeAnimated()

  // Fetch users with role 'Enseignant'
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getUsers()
        const enseignants = users.filter((user) => user.roleName === 'Enseignant')
        const options = enseignants.map((user) => ({ value: user.fullName, label: user.fullName }))
        setProfessors(options)
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }

    fetchUsers()
  }, [])

  const handleGetHoursWorked = async () => {
    let hasError = false
    if (!professorName.trim()) {
      setNameError(true)
      hasError = true
    } else {
      setNameError(false)
    }

    if (!date.trim()) {
      setDateError(true)
      hasError = true
    } else {
      setDateError(false)
    }

    if (hasError) return

    try {
      const data = await getHoursWorked(professorName, date)
      setSchedule(data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const convertToTimeSpanFormat = (totalHeures) => {
    const parts = totalHeures.split(':')
    if (parts.length === 2) {
      const hours = parseInt(parts[0])
      const minutes = parseInt(parts[1])
      return `${hours} heures ${minutes} minutes`
    }
    return '00 heures 00 minutes'
  }
  const customStyles = {
    control: (provided) => ({
      ...provided,
      minHeight: '56px',
      height: '56px',
    }),
    valueContainer: (provided) => ({
      ...provided,
      height: '56px',
      padding: '0 6px',
    }),
    input: (provided) => ({
      ...provided,
      margin: '0px',
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      height: '56px',
    }),
  }

  return (
    <>
      <CCard>
        <CCardHeader>
          <h2>Examiner les heures travaillées</h2>
        </CCardHeader>
        <CCardBody>
          <CCardTitle>Il faut saisir le nom de professeur ainsi que le mois voulus</CCardTitle>
          <CRow>
            <CCol md={6}>
              <div className="mb-4">
                <Select
                  components={animatedComponents}
                  styles={customStyles}
                  options={professors}
                  isSearchable={true}
                  isClearable={true}
                  closeMenuOnSelect={true}
                  placeholder="Rechercher par le nom de professeur"
                  onChange={(selectedOption) => {
                    setProfessorName(selectedOption ? selectedOption.value : '')
                    setNameError(false)
                  }}
                />
                {nameError && (
                  <div className="text-danger" style={{ fontSize: '0.75rem', marginLeft: '8px' }}>
                    Vous devez saisir un nom
                  </div>
                )}
              </div>
            </CCol>
            <CCol md={6}>
              <div className="mb-4">
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
          </CRow>
          <div>
            <CButton
              style={{ backgroundColor: '#002379', color: 'white' }}
              shape="rounded-pill"
              onClick={handleGetHoursWorked}
            >
              Obtenir le total des heures travaillées
            </CButton>
          </div>
          {schedule.length > 0 && (
            <div>
              <CCard className="my-4"></CCard>
              <h3>nombre total d'heures travaillées</h3>
              {schedule.map((item, index) => {
                const formattedTotalHeures = convertToTimeSpanFormat(item.totalHeures)
                return (
                  <CCard key={index} className="mb-3">
                    <CCardHeader>
                      <strong>{item.nomProfesseur}</strong> - {item.mois} {item.année}
                    </CCardHeader>
                    <CCardBody>
                      <p style={{ fontSize: '30' }}>
                        <span style={{ fontWeight: 'bold' }}>nombre total d'heures : </span>
                        {formattedTotalHeures}
                        <QueryBuilderIcon
                          className="mx-2"
                          color="secondary"
                          sx={{ fontSize: 25 }}
                        />
                      </p>
                      <div className="d-flex justify-content-end">
                        <AddFacture
                          selectedProfessor={item.nomProfesseur}
                          selectedYear={item.année}
                          selectedMonth={item.mois}
                          totalHours={item.totalHeures}
                        />
                      </div>
                    </CCardBody>
                  </CCard>
                )
              })}
            </div>
          )}
        </CCardBody>
      </CCard>
    </>
  )
}
