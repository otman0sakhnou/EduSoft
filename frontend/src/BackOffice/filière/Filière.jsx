/* eslint-disable react/no-unescaped-entities */
import React, { useState, useEffect } from 'react'
import {
  CButton,
  CTable,
  CTableBody,
  CTableCaption,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CPagination,
  CPaginationItem,
  CCard,
  CCardBody,
  CCardHeader,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormInput,
} from '@coreui/react'
import SearchIcon from '@mui/icons-material/Search'
import { getFilières, deleteFilière } from '../../Actions/BackOfficeActions/FilièreActions'
import AddFiliereDialog from './AddFilière'
import toast from 'react-hot-toast'
import UpdateFiliereDialog from './UpdateFilière'
import DeleteRounded from '@mui/icons-material/DeleteRounded'
import BlurOnRounded from '@mui/icons-material/BlurOnRounded'
import { InputAdornment, TextField } from '@mui/material'

export default function Filière() {
  const [filières, setFilières] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)
  const [searchTerm, setSearchTerm] = useState('')
  const [visible, setVisible] = useState(false)
  const [filièreID, setFilièreId] = useState(null)

  useEffect(() => {
    fetchFilières()
  }, [])

  const fetchFilières = async () => {
    try {
      const data = await getFilières()
      setFilières(data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const filterFilières = filières.filter((f) => {
    return f.nomFilière.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const handleDelete = async (id) => {
    try {
      if (!id) {
        console.error('Error deleting filiere: ID is undefined')
        return
      }
      setFilièreId(id)
      setVisible(true)
    } catch (error) {
      console.error('Error showing confirmation dialog:', error)
    }
  }

  const deleteConfirmed = async () => {
    try {
      const success = await deleteFilière(filièreID)
      if (success) {
        fetchFilières()
        toast.success('Filière supprimée avec succès')
        if (currentItems.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1)
        }
      }
    } catch (error) {
      console.error('Error deleting Filière:', error)
      toast.error('Échec de la suppression de Filière')
    }
    setVisible(false)
  }

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filterFilières.slice(indexOfFirstItem, indexOfLastItem)
  const hasNextPage = currentPage < Math.ceil(filterFilières.length / itemsPerPage)
  const hasPreviousPage = currentPage > 1

  return (
    <>
      <CCard className="shadow-lg">
        <CCardBody>
          <div className="container">
            <div className="row mb-4 align-items-center">
              <div className="col-lg-12 mb-3">
                <CCardHeader
                  style={{
                    padding: '0.75rem 1.25rem',
                    borderBottom: '1px solid #dee2e6',
                    borderRadius: '12px 12px 0 0',
                  }}
                >
                  <div className="d-flex align-items-center">
                    <h2
                      style={{
                        fontWeight: 'bold',
                      }}
                      className="mb-2 mx-3"
                    >
                      Les filières disponibles
                    </h2>
                    <div className="col-lg-8 ml-auto">
                      <CFormInput
                        type="text"
                        placeholder="Rechercher par le nom de filière..."
                        className="form-control"
                        value={searchTerm}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon />
                            </InputAdornment>
                          ),
                        }}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                </CCardHeader>
              </div>

              <div className="mt-3 mt-lg-0 text-end">
                <AddFiliereDialog fetchFilières={fetchFilières} />
              </div>
            </div>
            <CTable align="middle" className="mb-0 border" hover striped responsive>
              <CTableCaption>Détails des Filières</CTableCaption>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell
                    style={{ backgroundColor: '#57A6A1', color: 'white', fontWeight: 'bold' }}
                  >
                    Nom de Filière
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    style={{ backgroundColor: '#57A6A1', color: 'white', fontWeight: 'bold' }}
                  >
                    Description du Filière
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    style={{ backgroundColor: '#57A6A1', color: 'white', fontWeight: 'bold' }}
                    className="text-center"
                  >
                    <BlurOnRounded sx={{ fontSize: 30 }} />
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody hover>
                {currentItems.map((filière) => (
                  <CTableRow key={filière.idFilière}>
                    <CTableDataCell style={{ fontWeight: 'bold' }}>
                      {filière.nomFilière}
                    </CTableDataCell>
                    <CTableDataCell style={{ fontWeight: 'bold' }}>
                      {filière.description}
                    </CTableDataCell>
                    <CTableDataCell className="col-sm-2 text-center" style={{ fontWeight: 'bold' }}>
                      <UpdateFiliereDialog filière={filière} fetchFilières={fetchFilières} />
                      <DeleteRounded
                        fontSize="large"
                        onClick={() => handleDelete(filière.idFilière)}
                        color="error"
                      />
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
                {Array.from({ length: Math.ceil(filières.length / itemsPerPage) }, (_, index) => (
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
        </CCardBody>
      </CCard>
      <CModal
        backdrop="static"
        visible={visible}
        onClose={() => setVisible(false)}
        aria-labelledby="StaticBackdropExampleLabel"
      >
        <CModalHeader>
          <CModalTitle id="StaticBackdropExampleLabel">Confirmer l'action</CModalTitle>
        </CModalHeader>
        <CModalBody>Êtes-vous sûr de vouloir supprimer cette filière ?</CModalBody>
        <CModalFooter>
          <CButton
            shape="rounded-pill"
            style={{
              marginTop: '10px',
              padding: '10px 30px',
              fontSize: '16px',
              fontWeight: 'bold',
              borderRadius: '10px',
              border: '2px solid #007bff',
              color: '#ffffff',
              backgroundColor: '#007bff',
              cursor: 'pointer',
            }}
            onClick={deleteConfirmed}
          >
            Oui
          </CButton>
          <CButton
            shape="rounded-pill"
            style={{
              marginTop: '10px',
              marginLeft: '10px',
              padding: '10px 20px',
              fontSize: '16px',
              fontWeight: 'bold',
              borderRadius: '5px',
              border: '2px solid #dc3545',
              color: '#dc3545',
              backgroundColor: 'transparent',
              cursor: 'pointer',
            }}
            onClick={() => setVisible(false)}
          >
            Annuler
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}
