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
  CCardBody,
  CCard,
  CCardHeader,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from '@coreui/react'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteTwoTone'
import Fab from '@mui/material/Fab'
import { getModules } from '../../Actions/BackOfficeActions/ModuleActions'
import { deleteModule } from '../../Actions/BackOfficeActions/ModuleActions'
import AddModuleDialog from './AddModule'
import toast from 'react-hot-toast'
import UpdateModule from './UpdateModule'

export default function Module() {
  const [modules, setModules] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)
  const [searchTerm, setSearchTerm] = useState('')
  const [visible, setVisible] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  useEffect(() => {
    fetchModules()
  }, [])

  const fetchModules = async () => {
    try {
      const data = await getModules()
      setModules(data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const handleDelete = async () => {
    try {
      if (!deleteId) {
        console.error('Error deleting Module: ID is undefined')
        return
      }
      const success = await deleteModule(deleteId)
      if (success) {
        fetchModules()
        toast.success('Module supprimé avec succès')
        if (currentItems.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1)
        }
      }
      setDeleteId(deleteId)
    } catch (error) {
      console.error('Error deleting Module:', error)
      toast.error('Échec de la suppression de Module')
    } finally {
      setVisible(false)
    }
  }
  const filteredModules = modules.filter((module) =>
    module.nomModule.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredModules.slice(indexOfFirstItem, indexOfLastItem)
  const hasNextPage = currentPage < Math.ceil(filteredModules.length / itemsPerPage)
  const hasPreviousPage = currentPage > 1

  const handleOpenModal = (id) => {
    setDeleteId(id)
    setVisible(true)
  }

  return (
    <CCard>
      <CCardBody>
        <div className="container">
          <div className="row mb-4 align-items-center">
            <div className="col-lg-3 mb-3">
              <CCardHeader>
                <h1 className="text-2xl font-bold mb-2">Les modules disponibles</h1>
              </CCardHeader>
            </div>
            <div className="col-lg-8">
              <input
                type="text"
                placeholder="Rechercher par le nom de module..."
                className="form-control"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-lg-1 d-flex justify-content-lg-end mt-3 mt-lg-0">
              <AddModuleDialog fetchModules={fetchModules} />
            </div>
          </div>
          <CTable align="middle" className="mb-0 border" striped responsive>
            <CTableCaption>Détails des Modules</CTableCaption>
            <CTableHead color="dark">
              <CTableRow>
                <CTableHeaderCell scope="col">Nom de Module</CTableHeaderCell>
                <CTableHeaderCell scope="col">Nom du Filière</CTableHeaderCell>
                <CTableHeaderCell scope="col">Description du Filière</CTableHeaderCell>
                <CTableHeaderCell scope="col"></CTableHeaderCell>
                <CTableHeaderCell scope="col"></CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody hover>
              {currentItems.map((module) => (
                <CTableRow key={module.moduleId}>
                  <CTableDataCell>{module.nomModule}</CTableDataCell>
                  <CTableDataCell>{module.nomFilière}</CTableDataCell>
                  <CTableDataCell>{module.description}</CTableDataCell>
                  <CTableDataCell>
                    <UpdateModule module={module} fetchModules={fetchModules} />
                  </CTableDataCell>
                  <CTableDataCell>
                    <Fab
                      style={{ backgroundColor: '#C40C0C', color: 'white' }}
                      size="small"
                      onClick={() => handleOpenModal(module.moduleId)}
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
                { length: Math.ceil(filteredModules.length / itemsPerPage) },
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
      <CModal
        backdrop="static"
        visible={visible}
        onClose={() => setVisible(false)}
        aria-labelledby="StaticBackdropExampleLabel"
      >
        <CModalHeader closeButton>
          <CModalTitle id="StaticBackdropExampleLabel">Confirmation</CModalTitle>
        </CModalHeader>
        <CModalBody>Êtes-vous sûr de vouloir supprimer ce module ?</CModalBody>
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
            onClick={handleDelete}
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
              cursor: 'pointer',
            }}
            onClick={() => setVisible(false)}
          >
            Annuler
          </CButton>
        </CModalFooter>
      </CModal>
    </CCard>
  )
}
