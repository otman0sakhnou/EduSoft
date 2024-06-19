import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useAuth } from 'react-oidc-context'
import {
  CButton,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHeaderCell,
  CTableHead,
  CTableRow,
  CPagination,
  CRow,
  CCol,
  CTableCaption,
  CPaginationItem,
} from '@coreui/react'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'

const ProfSeanceTable = ({ sessions, getModuleById, getGroupeById }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [filteredSessions, setFilteredSessions] = useState([])
  const [originalSessions, setOriginalSessions] = useState([])
  const [groupes, setGroupes] = useState({})
  const [modules, setModules] = useState({})
  const [currentFilter, setCurrentFilter] = useState(null)
  const [sortOrder, setSortOrder] = useState('desc')
  const auth = useAuth()
  const username = auth?.user?.profile?.name
  const pageSize = 5
  const fetchGroupeById = async (groupeId) => {
    if (!groupes[groupeId]) {
      try {
        const groupe = await getGroupeById(groupeId)
        setGroupes((prevGroupes) => ({
          ...prevGroupes,
          [groupeId]: groupe,
        }))
      } catch (error) {
        console.error(`Error fetching groupe ${groupeId}:`, error)
        setGroupes((prevGroupes) => ({
          ...prevGroupes,
          [groupeId]: { nomGroupe: 'Unknown Group' },
        }))
      }
    }
  }

  const fetchModuleById = async (moduleId) => {
    if (!modules[moduleId]) {
      try {
        const module = await getModuleById(moduleId)
        setModules((prevModules) => ({
          ...prevModules,
          [moduleId]: module,
        }))
      } catch (error) {
        console.error(`Error fetching module ${moduleId}:`, error)
        setModules((prevModules) => ({
          ...prevModules,
          [moduleId]: { nomModule: 'Unknown Module' },
        }))
      }
    }
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const sessionData = await sessions()
        if (username && Array.isArray(sessionData)) {
          const filtered = sessionData.filter((session) => session.nomProfesseur === username)
          setOriginalSessions(filtered)
          applyFilter(filtered, currentFilter)
          filtered.forEach((session) => {
            fetchGroupeById(session.groupeId)
            fetchModuleById(session.moduleId)
          })
        } else {
          console.error('Sessions data is not an array or username is not defined.')
        }
      } catch (error) {
        console.error('Error fetching session data:', error)
      }
    }

    fetchData()
  }, [username, sessions, getGroupeById, getModuleById, currentFilter])
  const applyFilter = (sessions, filter) => {
    if (filter === 'year') {
      const currentYear = new Date().getFullYear()
      const filtered = sessions.filter(
        (session) => new Date(session.dateSéance).getFullYear() === currentYear,
      )
      setFilteredSessions(filtered)
    } else if (filter === 'month') {
      const currentMonth = new Date().getMonth()
      const filtered = sessions.filter(
        (session) => new Date(session.dateSéance).getMonth() === currentMonth,
      )
      setFilteredSessions(filtered)
      if (filtered.length > 0 && (currentPage - 1) * pageSize >= filtered.length) {
        setCurrentPage(Math.ceil(filtered.length / pageSize))
      }
    } else {
      setFilteredSessions(sessions)
    }
  }
  const applySort = () => {
    const sortedSessions = [...filteredSessions].sort((a, b) => {
      const dateA = new Date(a.dateSéance).getTime() // Convert date to timestamp
      const dateB = new Date(b.dateSéance).getTime() // Convert date to timestamp
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA
    })
    setFilteredSessions(sortedSessions)
  }
  const handleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    applySort()
  }

  const handleYearFilter = () => {
    setCurrentFilter('year')
  }
  const handleMonthFilter = () => {
    setCurrentFilter('month')
  }
  const endIndex = currentPage * pageSize
  const startIndex = endIndex - pageSize
  const currentSessions = filteredSessions.slice(startIndex, endIndex)
  const hasNextPage = currentPage < Math.ceil(filteredSessions.length / pageSize)
  const hasPreviousPage = currentPage > 1

  return (
    <div>
      <CRow className="text-end mb-2">
        <CCol>
          <CDropdown variant="btn-group">
            <CButton style={{ backgroundColor: '#3AA6B9', color: 'white' }} size="sm">
              Sélectionnez une date
            </CButton>
            <CDropdownToggle
              style={{ backgroundColor: '#3AA6B9', color: 'white' }}
              size="sm"
              split
            />
            <CDropdownMenu>
              <CDropdownItem onClick={handleYearFilter}>Cette année</CDropdownItem>
              <CDropdownItem onClick={handleMonthFilter}>Ce mois</CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
        </CCol>
      </CRow>
      <CTable align="middle" className="mb-0 border" hover responsive>
        <CTableCaption>Détails des séances effectuées par vous</CTableCaption>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell
              style={{ backgroundColor: '#3AA6B9', color: 'white', fontWeight: 'bold' }}
              scope="col"
            >
              Date de séance
              <span onClick={handleSortOrder} style={{ cursor: 'pointer', marginLeft: '4px' }}>
                {sortOrder === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
              </span>
            </CTableHeaderCell>
            <CTableHeaderCell
              style={{ backgroundColor: '#3AA6B9', color: 'white', fontWeight: 'bold' }}
              scope="col"
            >
              Début de la séance
            </CTableHeaderCell>
            <CTableHeaderCell
              style={{ backgroundColor: '#3AA6B9', color: 'white', fontWeight: 'bold' }}
              scope="col"
            >
              Fin de la séance
            </CTableHeaderCell>
            <CTableHeaderCell
              style={{ backgroundColor: '#3AA6B9', color: 'white', fontWeight: 'bold' }}
              scope="col"
            >
              Groupe
            </CTableHeaderCell>
            <CTableHeaderCell
              style={{ backgroundColor: '#3AA6B9', color: 'white', fontWeight: 'bold' }}
              scope="col"
            >
              Module
            </CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {currentSessions.map((session, index) => (
            <CTableRow key={session.idSéance}>
              <CTableDataCell style={{ fontWeight: 'bold' }}>{session.dateSéance}</CTableDataCell>
              <CTableDataCell style={{ fontWeight: 'bold' }}>{session.heureDébut}</CTableDataCell>
              <CTableDataCell style={{ fontWeight: 'bold' }}>{session.heureFin}</CTableDataCell>
              <CTableDataCell style={{ fontWeight: 'bold' }}>
                {groupes[session.groupeId]?.nomGroupe || 'Loading...'}
              </CTableDataCell>
              <CTableDataCell style={{ fontWeight: 'bold' }}>
                {modules[session.moduleId]?.nomModule || 'Loading...'}
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>

      <div className="d-flex justify-content-center">
        <CPagination aria-label="Page navigation example">
          <CPaginationItem
            aria-label="Previous"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={!hasPreviousPage}
          >
            <span aria-hidden="true">&laquo;</span>
          </CPaginationItem>
          {Array.from({ length: Math.ceil(filteredSessions.length / pageSize) }, (_, index) => (
            <CPaginationItem
              key={index}
              active={index + 1 === currentPage}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </CPaginationItem>
          ))}
          <CPaginationItem
            aria-label="Next"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={!hasNextPage}
          >
            <span aria-hidden="true">&raquo;</span>
          </CPaginationItem>
        </CPagination>
      </div>
    </div>
  )
}

ProfSeanceTable.propTypes = {
  sessions: PropTypes.func.isRequired,
  getModuleById: PropTypes.func.isRequired,
  getGroupeById: PropTypes.func.isRequired,
}

export default ProfSeanceTable
