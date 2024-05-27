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
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import { Link } from 'react-router-dom'
import { InputAdornment, TextField } from '@mui/material'
import Search from '@mui/icons-material/Search'
import DeleteRounded from '@mui/icons-material/DeleteRounded'
import BlurOnRounded from '@mui/icons-material/BlurOnRounded'

export default function Groupe() {
  const [groupes, setGroupes] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)
  const [searchTerm, setSearchTerm] = useState('')
  const [visible, setVisible] = useState(false)
  const [groupeIdToDelete, setGroupeIdToDelete] = useState(null)

  useEffect(() => {
    fetchGroupe()
  }, [])
  //get all groupes
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
      <CCard className="shadow-lg">
        <CCardBody>
          <div className="container">
            <div className="row mb-4 align-items-center">
              <div className="col-lg-12 mb-3">
                <CCardHeader
                  style={{
                    backgroundColor: '#e9ecef',
                    padding: '0.75rem 1.25rem',
                    borderBottom: '1px solid #dee2e6',
                    borderRadius: '12px 12px 0 0',
                  }}
                >
                  <div className="d-flex align-items-center">
                    <h2
                      style={{
                        fontWeight: 'bold',
                        color: '#343a40',
                      }}
                      className="mb-2 mx-3"
                    >
                      Les groupes disponibles
                    </h2>
                    <div className="col-lg-8">
                      <TextField
                        type="text"
                        placeholder="Rechercher par le nom de groupe ..."
                        className="form-control"
                        value={searchTerm}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Search />
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
                <AddGroupeDialog fetchGroupe={fetchGroupe} />
              </div>
            </div>
            <CTable align="middle" className="mb-0 border" hover striped responsive>
              <CTableCaption>Détails des Groupes</CTableCaption>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell
                    style={{ backgroundColor: '#57A6A1', color: 'white', fontWeight: 'bold' }}
                  >
                    Nom de Groupe
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
                {currentItems.map((groupe, index) => (
                  <CTableRow key={index}>
                    <CTableDataCell>{groupe.nomGroupe}</CTableDataCell>
                    <CTableDataCell>{groupe.nomFilière}</CTableDataCell>
                    <CTableDataCell>{groupe.description}</CTableDataCell>
                    <CTableDataCell className="text-center">
                      <Link
                        to={`/étudiant/ÉtudiantParGroupe/${groupe.nomGroupe}`}
                        style={{ color: 'inherit', textDecoration: 'none' }}
                      >
                        <RemoveRedEyeIcon style={{ color: '#FFC55A' }} />
                      </Link>
                      <UpdateGroupeDialog groupe={groupe} fetchGroupe={fetchGroupe} />
                      <DeleteRounded
                        sx={{ fontSize: 30 }}
                        style={{ color: '#E72929' }}
                        onClick={() => handleDelete(groupe.groupeID)}
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
            shape="rounded-pill"
            style={{
              marginTop: '10px',
              padding: '10px 30px',
              fontSize: '16px',
              fontWeight: 'bold',
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
