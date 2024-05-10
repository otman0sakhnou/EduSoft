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
} from '@coreui/react'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteTwoTone'
import Fab from '@mui/material/Fab'
import { getFilières, deleteFilière } from '../../Actions/BackOfficeActions/FilièreActions'
import AddFiliereDialog from './AddFilière'
import toast from 'react-hot-toast'
import UpdateFiliereDialog from './UpdateFilière'

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
        const updatedFilières = filières.filter((f) => f.idFilière !== filièreID)
        setFilières(updatedFilières)
        toast.success('Filière supprimée avec succès')
        if (updatedFilières.length === 0 && currentPage > 1) {
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
      <CCard>
        <CCardBody>
          <div className="container">
            <div className="row mb-4 align-items-center">
              <div className="col-lg-3 mb-3">
                <CCardHeader>
                  <h1 className="text-2xl font-bold mb-2">Les filières disponibles</h1>
                </CCardHeader>
              </div>
              <div className="col-lg-8">
                <input
                  type="text"
                  placeholder="Rechercher par le nom de filière..."
                  className="form-control"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="col-lg-1 d-flex justify-content-lg-end mt-3 mt-lg-0">
                <AddFiliereDialog fetchFilières={fetchFilières} />
              </div>
            </div>
            <CTable align="middle" className="mb-0 border" striped responsive>
              <CTableCaption>Détails des Filières</CTableCaption>
              <CTableHead color="dark">
                <CTableRow>
                  <CTableHeaderCell>Nom de Filière</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Description du Filière</CTableHeaderCell>
                  <CTableHeaderCell className="text-center" scope="col"></CTableHeaderCell>
                  <CTableHeaderCell className="text-center" scope="col"></CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody hover>
                {currentItems.map((filière) => (
                  <CTableRow key={filière.idFilière}>
                    <CTableDataCell>{filière.nomFilière}</CTableDataCell>
                    <CTableDataCell>{filière.description}</CTableDataCell>
                    <CTableDataCell>
                      <UpdateFiliereDialog filière={filière} fetchFilières={fetchFilières} />
                    </CTableDataCell>
                    <CTableDataCell>
                      <Fab
                        style={{ backgroundColor: '#C40C0C', color: 'white' }}
                        size="small"
                        onClick={() => handleDelete(filière.idFilière)}
                      >
                        <DeleteOutlinedIcon />
                      </Fab>
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
                {Array.from(
                  { length: Math.ceil(filterFilières.length / itemsPerPage) },
                  (_, index) => (
                    <CPaginationItem
                      key={index}
                      active={index + 1 === currentPage}
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </CPaginationItem>
                  ),
                )}
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
            style={{
              marginTop: '10px',
              padding: '10px 20px',
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
