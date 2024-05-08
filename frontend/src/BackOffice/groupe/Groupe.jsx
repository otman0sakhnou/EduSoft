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
import { getGroupes } from '../../Actions/BackOfficeActions/GroupeActions'
import { deleteGroupe } from '../../Actions/BackOfficeActions/GroupeActions'
import AddGroupeDialog from './AddGroupe'
import toast from 'react-hot-toast'
import UpdateGroupeDialog from './UpdateGroupe'

export default function Groupe() {
  const [groupes, setGroupes] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)
  const [searchTerm, setSearchTerm] = useState('')
  const [visible, setVisible] = useState(false)
  const [groupeIdToDelete, setGroupeIdToDelete] = useState(null)

  useEffect(() => {
    fetchGroupe()
  })

  const fetchGroupe = async () => {
    try {
      const data = await getGroupes()
      setGroupes(data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }
  const handleDelete = async (id) => {
    try {
      if (!id) {
        console.error('Error deleting groupe: ID is undefined')
        return
      }
      setGroupeIdToDelete(id)
      setVisible(true)
    } catch (error) {
      console.error('Error showing confirmation dialog:', error)
    }
  }

  const deleteConfirmed = async () => {
    try {
      const success = await deleteGroupe(groupeIdToDelete)
      if (success) {
        fetchGroupe()
        toast.success('Groupe supprimé avec succès')
        if (currentItems.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1)
        }
      }
    } catch (error) {
      console.error('Error deleting groupe:', error)
      toast.error('Échec de la suppression de groupe')
    }
    setVisible(false)
  }

  const filterGroupes = groupes.filter((groupe) => {
    return groupe.nomGroupe.toLowerCase().includes(searchTerm.toLowerCase())
  })
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filterGroupes.slice(indexOfFirstItem, indexOfLastItem)
  const hasNextPage = currentPage < Math.ceil(filterGroupes.length / itemsPerPage)
  const hasPreviousPage = currentPage > 1

  return (
    <>
      <CCard>
        <CCardBody>
          <div className="container">
            <div className="row mb-4 align-items-center">
              <div className="col-lg-3 mb-3">
                <CCardHeader>
                  <h1 className="text-2xl font-bold ">Les groupes disponibles</h1>
                </CCardHeader>
              </div>
              <div className="col-lg-8">
                <input
                  type="text"
                  placeholder="Rechercher par le nom de groupe ..."
                  className="form-control"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="col-lg-1 d-flex justify-content-lg-end mt-3 mt-lg-0">
                <AddGroupeDialog fetchGroupe={fetchGroupe} />
              </div>
            </div>
            <CTable striped responsive>
              <CTableCaption>Détails des Groupes</CTableCaption>
              <CTableHead color="dark">
                <CTableRow>
                  <CTableHeaderCell scope="col">Nom de Groupe</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Nom du Filière</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Description du Filière</CTableHeaderCell>
                  <CTableHeaderCell scope="col"></CTableHeaderCell>
                  <CTableHeaderCell scope="col"></CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody hover>
                {currentItems.map((groupe, index) => (
                  <CTableRow key={index}>
                    <CTableDataCell>{groupe.nomGroupe}</CTableDataCell>
                    <CTableDataCell>{groupe.nomFilière}</CTableDataCell>
                    <CTableDataCell>{groupe.description}</CTableDataCell>
                    <CTableDataCell>
                      <UpdateGroupeDialog groupe={groupe} fetchGroupes={fetchGroupe} />
                    </CTableDataCell>
                    <CTableDataCell>
                      <Fab
                        style={{ backgroundColor: '#C40C0C', color: 'white' }}
                        size="small"
                        onClick={() => handleDelete(groupe.groupeID)}
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
                {Array.from({ length: Math.ceil(groupes.length / itemsPerPage) }, (_, index) => (
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
        <CModalBody>Êtes-vous sûr de vouloir supprimer ce groupe ?</CModalBody>
        <CModalFooter>
          <CButton
            style={{
              marginTop: '10px',
              padding: '10px 20px',
              fontSize: '16px',
              fontWeight: 'bold',
              borderRadius: '5px',
              border: '2px solid #007bff',
              color: '#007bff',
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
