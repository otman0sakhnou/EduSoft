import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useAuth } from 'react-oidc-context'
import {
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
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CButton,
  CPaginationItem,
} from '@coreui/react'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'

const monthMapping = {
  janvier: 1,
  février: 2,
  mars: 3,
  avril: 4,
  mai: 5,
  juin: 6,
  juillet: 7,
  août: 8,
  septembre: 9,
  octobre: 10,
  novembre: 11,
  décembre: 12,
}

const ProfInvoicesTable = ({ invoices }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [filteredInvoices, setFilteredInvoices] = useState([])
  const [originalInvoices, setOriginalInvoices] = useState([])
  const auth = useAuth()
  const username = auth?.user?.profile?.name
  const pageSize = 5
  const [currentFilter, setCurrentFilter] = useState('year')
  const [sortOrder, setSortOrder] = useState('asc')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const invoiceData = await invoices()
        const filtered = invoiceData.filter((invoice) => invoice.nomProfesseur === username)
        setOriginalInvoices(filtered)
        applyFilter(filtered, currentFilter)
      } catch (error) {
        console.error('Error fetching invoice data:', error)
      }
    }

    fetchData()
  }, [username, invoices, currentFilter])

  const applyFilter = (invoices, filter) => {
    let filtered = invoices

    if (filter === 'year') {
      const currentYear = new Date().getFullYear()
      filtered = invoices.filter((invoice) => parseInt(invoice.année) === currentYear)
    } else if (filter === 'month') {
      const currentMonth = new Date().getMonth() + 1
      filtered = invoices.filter((invoice) => {
        const invoiceMonth = monthMapping[invoice.mois.toLowerCase()]
        return invoiceMonth === currentMonth
      })
    }
    filtered = filtered.sort(sortFacturesByDate)
    setFilteredInvoices(filtered)
    if (filtered.length > 0 && (currentPage - 1) * pageSize >= filtered.length) {
      setCurrentPage(Math.ceil(filtered.length / pageSize))
    } else if (filtered.length === 0) {
      setCurrentPage(1)
    }
  }
  const sortFacturesByDate = (a, b) => {
    const monthA = monthMapping[a.mois.toLowerCase()]
    const monthB = monthMapping[b.mois.toLowerCase()]
    if (sortOrder === 'desc') {
      return monthB - monthA
    } else {
      return monthA - monthB
    }
  }
  const handleYearFilter = () => {
    setCurrentFilter('year')
  }

  const handleMonthFilter = () => {
    setCurrentFilter('month')
  }

  const toggleSortOrder = () => {
    const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc'
    setSortOrder(newSortOrder)
    setFilteredInvoices([...filteredInvoices].sort(sortFacturesByDate))
  }
  const endIndex = currentPage * pageSize
  const startIndex = endIndex - pageSize
  const currentInvoices = filteredInvoices.slice(startIndex, endIndex)
  const hasNextPage = currentPage < Math.ceil(filteredInvoices.length / pageSize)
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
        <CTableCaption>Détails de votre factures</CTableCaption>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell
              style={{ backgroundColor: '#3AA6B9', color: 'white', fontWeight: 'bold' }}
              scope="col"
            >
              Mois
              <span onClick={toggleSortOrder} style={{ cursor: 'pointer', marginLeft: '4px' }}>
                {sortOrder === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
              </span>
            </CTableHeaderCell>
            <CTableHeaderCell
              style={{ backgroundColor: '#3AA6B9', color: 'white', fontWeight: 'bold' }}
              scope="col"
            >
              Année
            </CTableHeaderCell>
            <CTableHeaderCell
              style={{ backgroundColor: '#3AA6B9', color: 'white', fontWeight: 'bold' }}
              scope="col"
            >
              Montant par Heure
            </CTableHeaderCell>
            <CTableHeaderCell
              style={{ backgroundColor: '#3AA6B9', color: 'white', fontWeight: 'bold' }}
              scope="col"
            >
              Total Heures
            </CTableHeaderCell>
            <CTableHeaderCell
              style={{ backgroundColor: '#3AA6B9', color: 'white', fontWeight: 'bold' }}
              scope="col"
            >
              Montant Total
            </CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {currentInvoices.map((invoice) => (
            <CTableRow key={invoice.factureId}>
              <CTableDataCell style={{ fontWeight: 'bold' }}>{invoice.mois}</CTableDataCell>
              <CTableDataCell style={{ fontWeight: 'bold' }}>{invoice.année}</CTableDataCell>
              <CTableDataCell style={{ fontWeight: 'bold' }}>
                {invoice.montantParHeure}
              </CTableDataCell>
              <CTableDataCell style={{ fontWeight: 'bold' }}>{invoice.totalHeures}</CTableDataCell>
              <CTableDataCell style={{ fontWeight: 'bold' }}>
                {invoice.montantTotale}
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
          {Array.from({ length: Math.ceil(filteredInvoices.length / pageSize) }, (_, index) => (
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

ProfInvoicesTable.propTypes = {
  invoices: PropTypes.func.isRequired,
}

export default ProfInvoicesTable
