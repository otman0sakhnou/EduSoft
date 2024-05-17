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
import SearchIcon from '@mui/icons-material/Search'
import { getAllFactures, deleteFacture } from '../../Actions/BackOfficeActions/FactureActions'
import toast from 'react-hot-toast'
import DeleteRounded from '@mui/icons-material/DeleteRounded'
import BlurOnRounded from '@mui/icons-material/BlurOnRounded'
import { InputAdornment, TextField } from '@mui/material'

export default function Facture() {
  const [factures, setFactures] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchDate, setSearchDate] = useState('')
  const [visible, setVisible] = useState(false)
  const [factureID, setFactureId] = useState(null)

  useEffect(() => {
    fetchFactures()
  }, [])

  const fetchFactures = async () => {
    try {
      const data = await getAllFactures()
      setFactures(data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const filterFactures = factures.filter((f) => {
    const matchesName = f.nomProfesseur.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDate = searchDate ? f.dateFacture.includes(searchDate) : true
    return matchesName && matchesDate
  })

  const handleDelete = async (id) => {
    try {
      if (!id) {
        console.error('Error deleting facture: ID is undefined')
        return
      }
      setFactureId(id)
      setVisible(true)
    } catch (error) {
      console.error('Error showing confirmation dialog:', error)
    }
  }

  const deleteConfirmed = async () => {
    try {
      const success = await deleteFacture(factureID)
      if (success) {
        fetchFactures()
        toast.success('Facture supprimée avec succès')
        if (currentItems.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1)
        }
      }
    } catch (error) {
      console.error('Error deleting Facture:', error)
      toast.error('Échec de la suppression de Facture')
    }
    setVisible(false)
  }

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filterFactures.slice(indexOfFirstItem, indexOfLastItem)
  const hasNextPage = currentPage < Math.ceil(filterFactures.length / itemsPerPage)
  const hasPreviousPage = currentPage > 1

  return (
    <>
      <CCard className="shadow-lg">
        <CCardBody>
          <div className="container">
            <div className="row mb-4 align-items-center">
              <div className="col-lg-12 mb-3">
                <CCardHeader>
                  <div className="d-flex align-items-center">
                    <h2 className="text-2xl font-bold mb-2 mx-5">Les factures disponibles</h2>
                    <div className="col-sm-7 d-flex">
                      <TextField
                        type="text"
                        label="Rechercher par le nom de proffesseur"
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
                      <TextField
                        type="date"
                        label="Rechercher par date..."
                        className="form-control ml-3"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        value={searchDate}
                        onChange={(e) => setSearchDate(e.target.value)}
                        style={{ marginLeft: '16px' }}
                      />
                    </div>
                  </div>
                </CCardHeader>
              </div>

              <div className="mt-3 mt-lg-0 text-end">
                {/* <AddFactureDialog fetchFactures={fetchFactures} /> */}
              </div>
            </div>
            <CTable align="middle" className="mb-0 border" hover striped responsive>
              <CTableCaption>Détails des Factures</CTableCaption>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell
                    style={{ backgroundColor: '#57A6A1', color: 'white', fontWeight: 'bold' }}
                  >
                    Nom de Proffesseur
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    style={{ backgroundColor: '#57A6A1', color: 'white', fontWeight: 'bold' }}
                  >
                    Date de Facture
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    style={{ backgroundColor: '#57A6A1', color: 'white', fontWeight: 'bold' }}
                  >
                    Montant ParHeure
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    style={{ backgroundColor: '#57A6A1', color: 'white', fontWeight: 'bold' }}
                  >
                    Total Heures
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    style={{ backgroundColor: '#57A6A1', color: 'white', fontWeight: 'bold' }}
                  >
                    Montant Total
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
                {currentItems.map((facture) => (
                  <CTableRow key={facture.idFacture}>
                    <CTableDataCell style={{ fontWeight: 'bold' }}>
                      {facture.nomProfesseur}
                    </CTableDataCell>
                    <CTableDataCell style={{ fontWeight: 'bold' }}>{facture.mois}</CTableDataCell>
                    <CTableDataCell style={{ fontWeight: 'bold' }}>
                      {facture.montantParHeure} Dh
                    </CTableDataCell>
                    <CTableDataCell style={{ fontWeight: 'bold' }}>
                      {facture.totalHeures}
                    </CTableDataCell>
                    <CTableDataCell style={{ fontWeight: 'bold' }}>
                      {facture.montantTotale} Dh
                    </CTableDataCell>
                    <CTableDataCell className="col-sm-2 text-center" style={{ fontWeight: 'bold' }}>
                      <DeleteRounded
                        fontSize="large"
                        onClick={() => handleDelete(facture.factureId)}
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
                {Array.from({ length: Math.ceil(factures.length / itemsPerPage) }, (_, index) => (
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
        <CModalBody>Êtes-vous sûr de vouloir supprimer cette facture ?</CModalBody>
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
