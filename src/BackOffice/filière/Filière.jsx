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
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilDelete, cilReload, cilSearch } from '@coreui/icons'
import { getFilières } from '../../Actions/BackOfficeActions/FilièreActions'
import { getFilièreByName } from '../../Actions/BackOfficeActions/FilièreActions'
import { deleteFilière } from '../../Actions/BackOfficeActions/FilièreActions'
import AddFiliereDialog from './AddFilière'
import toast from 'react-hot-toast'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'

export default function Filière() {
  const [filières, setFilières] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchFilières()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      searchFilièreByName()
    } else {
      fetchFilières()
    }
  }, [searchTerm])

  const fetchFilières = async () => {
    try {
      const data = await getFilières()
      setFilières(data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const searchFilièreByName = async () => {
    try {
      const data = await getFilièreByName(searchTerm)
      setFilières(data)
    } catch (error) {
      console.error('Error fetching data:', error)
      setFilières([])
    }
  }
  const handleDelete = async (id) => {
    try {
      confirmAlert({
        title: 'Confirm Action',
        message: 'Êtes-vous sûr de vouloir supprimer cette filière ?',
        buttons: [
          {
            label: 'Oui',
            onClick: async () => {
              try {
                const success = await deleteFilière(id)
                if (success) {
                  fetchFilières()
                  toast.success('Filière supprimée avec succès')
                }
              } catch (error) {
                console.error('Error deleting Filière:', error)
                toast.error('Échec de la suppression de Filière')
              }
            },
          },
          {
            label: 'Annuler',
            onClick: () => {},
          },
        ],
      })
    } catch (error) {
      console.error('Error showing confirmation dialog:', error)
    }
  }

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filières.slice(indexOfFirstItem, indexOfLastItem)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  return (
    <div>
      <div className="mb-4 d-flex align-items-center">
        <h1 className="text-2xl font-bold mb-2">Les filières disponibles</h1>
        <div className="input-group flex-grow-1">
          <input
            type="text"
            placeholder="Rechercher par le nom de filière..."
            className="form-control"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="ml-5">
          <AddFiliereDialog />
        </div>
      </div>
      <CTable striped responsive>
        <CTableCaption>Détails des Filières</CTableCaption>
        <CTableHead color="dark">
          <CTableRow>
            <CTableHeaderCell scope="col">Nom de Filière</CTableHeaderCell>
            <CTableHeaderCell scope="col">Description du Filière</CTableHeaderCell>
            <CTableHeaderCell scope="col"></CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody hover>
          {currentItems.map((filière, index) => (
            <CTableRow key={index}>
              <CTableDataCell>{filière.nomFilière}</CTableDataCell>
              <CTableDataCell>{filière.description}</CTableDataCell>
              <CTableDataCell>
                <CButton color="info" variant="outline" size="sm">
                  <CIcon icon={cilReload} />
                </CButton>{' '}
                <CButton
                  color="danger"
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(filière.idFilière)}
                >
                  <CIcon icon={cilDelete} />
                </CButton>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
      <div className="d-flex justify-content-center">
        <CPagination aria-label="Page navigation example">
          <CPaginationItem aria-label="Previous" onClick={() => paginate(currentPage - 1)}>
            <span aria-hidden="true">&laquo;</span>
          </CPaginationItem>
          {Array.from({ length: Math.ceil(filières.length / itemsPerPage) }, (_, index) => (
            <CPaginationItem key={index} onClick={() => paginate(index + 1)}>
              {index + 1}
            </CPaginationItem>
          ))}
          <CPaginationItem aria-label="Next" onClick={() => paginate(currentPage + 1)}>
            <span aria-hidden="true">&raquo;</span>
          </CPaginationItem>
        </CPagination>
      </div>
    </div>
  )
}
