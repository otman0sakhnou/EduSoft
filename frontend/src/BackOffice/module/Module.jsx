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
import SearchIcon from '@mui/icons-material/Search'
import { InputAdornment, TextField } from '@mui/material'
import { getModules } from '../../Actions/BackOfficeActions/ModuleActions'
import { deleteModule } from '../../Actions/BackOfficeActions/ModuleActions'
import AddModuleDialog from './AddModule'
import toast from 'react-hot-toast'
import UpdateModule from './UpdateModule'
import DeleteRounded from '@mui/icons-material/DeleteRounded'
import BlurOnRounded from '@mui/icons-material/BlurOnRounded'

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
    <CCard className="shadow-lg">
      <CCardBody>
        <div className="container">
          <div className="row mb-4 align-items-center">
            <div className="col-lg-12 mb-3">
              <CCardHeader>
                <div className="d-flex align-items-center">
                  <h2 className="text-2xl font-bold mb-2 mx-3">Les modules disponibles</h2>
                  <div className="col-lg-8">
                    <TextField
                      type="text"
                      label="Rechercher par le nom de module..."
                      className="form-control"
                      value={searchTerm}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
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
              <AddModuleDialog fetchModules={fetchModules} />
            </div>
          </div>
          <CTable align="middle" className="mb-0 border" hover striped responsive>
            <CTableCaption>Détails des Modules</CTableCaption>
            <CTableHead color="dark">
              <CTableRow>
                <CTableHeaderCell
                  style={{ backgroundColor: '#57A6A1', color: 'white', fontWeight: 'bold' }}
                >
                  Nom de Module
                </CTableHeaderCell>
                <CTableHeaderCell
                  style={{ backgroundColor: '#57A6A1', color: 'white', fontWeight: 'bold' }}
                >
                  Nom du Filière
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
                  {' '}
                  <BlurOnRounded sx={{ fontSize: 30 }} />
                </CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody hover>
              {currentItems.map((module) => (
                <CTableRow key={module.moduleId}>
                  <CTableDataCell>{module.nomModule}</CTableDataCell>
                  <CTableDataCell>{module.nomFilière}</CTableDataCell>
                  <CTableDataCell>{module.description}</CTableDataCell>
                  <CTableDataCell className="text-center">
                    <UpdateModule module={module} fetchModules={fetchModules} />
                    <DeleteRounded
                      sx={{ fontSize: 30 }}
                      color="error"
                      onClick={() => handleOpenModal(module.moduleId)}
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
            onClick={handleDelete}
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
    </CCard>
  )
}
