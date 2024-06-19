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
import { getSeancesByProfessorAndDate } from '../../Actions/BackOfficeActions/SéanceActions'
import { getModuleById } from '../../Actions/BackOfficeActions/ModuleActions'
import { getGroupeById } from '../../Actions/BackOfficeActions/GroupeActions'
import toast from 'react-hot-toast'
import DeleteRounded from '@mui/icons-material/DeleteRounded'
import BlurOnRounded from '@mui/icons-material/BlurOnRounded'
import { InputAdornment, TextField } from '@mui/material'
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined'
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import CloudDownloadIcon from '@mui/icons-material/CloudDownload'
import IconButton from '@mui/material/IconButton'
import Collapse from '@mui/material/Collapse'
import { Typography, Box } from '@mui/material'
import jsPDF from 'jspdf'

export default function Facture() {
  const [factures, setFactures] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)
  const [searchTerm, setSearchTerm] = useState('')
  const [visible, setVisible] = useState(false)
  const [factureID, setFactureId] = useState(null)
  const [openCollapse, setOpenCollapse] = useState({})
  const [seances, setSeances] = useState({})
  const [sortOrder, setSortOrder] = useState('asc')
  const [sortDateOrder, setSortDateOrder] = useState('asc')

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

  const fetchSeances = async (nomProfesseur, year, month) => {
    try {
      const seancesData = await getSeancesByProfessorAndDate(nomProfesseur, year, month)
      const seancesWithDetails = await Promise.all(
        seancesData.map(async (seance) => {
          const module = await getModuleById(seance.moduleId)
          const groupe = await getGroupeById(seance.groupeId)
          return { ...seance, module, groupe }
        }),
      )
      setSeances((prevSeances) => ({
        ...prevSeances,
        [`${nomProfesseur}-${year}-${month}`]: seancesWithDetails,
      }))
    } catch (error) {
      console.error('Error fetching seances:', error)
    }
  }

  const handleCollapse = (nomProfesseur, year, month) => {
    const key = `${nomProfesseur}-${year}-${month}`
    if (openCollapse === key) {
      setOpenCollapse(true)
    } else {
      setOpenCollapse(key)
      if (!seances[key]) {
        fetchSeances(nomProfesseur, year, month)
      }
    }
  }
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
  }
  const toggleSortDateOrder = () => {
    setSortDateOrder(sortDateOrder === 'asc' ? 'desc' : 'asc')
  }
  const filterFactures = factures.filter((f) => {
    const matchesName =
      f.nomProfesseur && f.nomProfesseur.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesName
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
  const generatePDF = (facture) => {
    const doc = new jsPDF()
    doc.setFont('helvetica')
    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(33, 37, 41)
    doc.text('Détails de la facture', 105, 20, null, null, 'center')
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(99, 110, 114)
    doc.text(`Géneré le: ${new Date().toLocaleDateString()}`, 105, 30, null, null, 'center')
    doc.setLineWidth(0.5)
    doc.line(20, 35, 190, 35)
    doc.setFontSize(12)
    doc.setTextColor(33, 37, 41)

    const details = [
      { label: 'Nom de Professeur :', value: facture.nomProfesseur },
      { label: 'Date de Facture :', value: `${facture.mois} - ${facture.année}` },
      { label: 'Montant Par Heure :', value: `${facture.montantParHeure} Dh` },
      { label: 'Total Heures :', value: facture.totalHeures },
      { label: 'Montant Total :', value: `${facture.montantTotale} Dh` },
    ]

    let yPosition = 45
    details.forEach((detail) => {
      doc.setFont('helvetica', 'bold')
      doc.text(detail.label, 20, yPosition)
      doc.setFont('helvetica', 'normal')
      doc.text(detail.value, 70, yPosition)
      yPosition += 10
    })
    doc.setLineWidth(0.5)
    doc.line(20, yPosition + 5, 190, yPosition + 5)
    doc.setFontSize(10)
    doc.setTextColor(99, 110, 114)
    doc.text('Généré par EduSoft', 105, 290, null, null, 'center')
    doc.save(`facture_${facture.nomProfesseur}.pdf`)
  }
  const sortFacturesByDate = (a, b) => {
    const months = {
      janvier: 0,
      février: 1,
      mars: 2,
      avril: 3,
      mai: 4,
      juin: 5,
      juillet: 6,
      août: 7,
      septembre: 8,
      octobre: 9,
      novembre: 10,
      décembre: 11,
    }
    const dateA = new Date(a.année, months[a.mois.toLowerCase()])
    const dateB = new Date(b.année, months[b.mois.toLowerCase()])
    return sortDateOrder === 'asc' ? dateA - dateB : dateB - dateA
  }

  const sortedFactures = filterFactures.sort(sortFacturesByDate)

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = sortedFactures.slice(indexOfFirstItem, indexOfLastItem)
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
                    <h2
                      style={{
                        fontWeight: 'bold',
                      }}
                      className="mb-2 mx-3"
                    >
                      Les factures disponibles
                    </h2>
                    <div className="col-sm-8 d-flex">
                      <TextField
                        type="text"
                        placeholder="Rechercher par le nom de proffesseur"
                        className="form-control"
                        value={searchTerm}
                        InputProps={{
                          startAdornment: (
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
            </div>
            <CTable align="middle" className="mb-0 border" hover responsive>
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
                    <IconButton
                      size="small"
                      className="text-white"
                      onClick={toggleSortDateOrder}
                      aria-label="sort"
                    >
                      {sortDateOrder === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
                    </IconButton>
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
              <CTableBody>
                {currentItems.map((facture) => {
                  const key = `${facture.nomProfesseur}-${facture.année}-${facture.mois}`
                  return (
                    <React.Fragment key={facture.idFacture}>
                      <CTableRow>
                        <CTableDataCell style={{ fontWeight: 'bold' }}>
                          {facture.nomProfesseur}
                        </CTableDataCell>
                        <CTableDataCell style={{ fontWeight: 'bold' }}>
                          {facture.mois} - {facture.année}
                        </CTableDataCell>
                        <CTableDataCell style={{ fontWeight: 'bold' }}>
                          {facture.montantParHeure} Dh
                        </CTableDataCell>
                        <CTableDataCell style={{ fontWeight: 'bold' }}>
                          {facture.totalHeures}
                        </CTableDataCell>
                        <CTableDataCell style={{ fontWeight: 'bold' }}>
                          {facture.montantTotale} Dh
                        </CTableDataCell>
                        <CTableDataCell
                          className="col-sm-2 text-center"
                          style={{ fontWeight: 'bold' }}
                        >
                          <IconButton color="primary" onClick={() => generatePDF(facture)}>
                            <CloudDownloadIcon />
                          </IconButton>
                          <IconButton color="error" onClick={() => handleDelete(facture.factureId)}>
                            <DeleteRounded />
                          </IconButton>
                          <IconButton
                            onClick={() =>
                              handleCollapse(facture.nomProfesseur, facture.année, facture.mois)
                            }
                          >
                            {openCollapse === key ? (
                              <KeyboardArrowUpOutlinedIcon
                                style={{
                                  borderRadius: '50%',
                                  color: '#FFFFFF',
                                  background: '#57A6A1',
                                }}
                              />
                            ) : (
                              <KeyboardArrowDownOutlinedIcon
                                style={{
                                  borderRadius: '50%',
                                  color: '#FFFFFF',
                                  background: '#57A6A1',
                                }}
                              />
                            )}
                          </IconButton>
                        </CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableDataCell colSpan="6" style={{ paddingBottom: 0, paddingTop: 0 }}>
                          <Collapse in={openCollapse === key} timeout="auto" unmountOnExit>
                            <Box margin={1}>
                              <Typography
                                variant="h6"
                                style={{
                                  fontWeight: 'bold',
                                  color: '#343a40',
                                }}
                                gutterBottom
                                component="div"
                              >
                                Les séances effectuées :
                              </Typography>
                              <CTable className="border" size="small" aria-label="purchases">
                                <CTableHead>
                                  <CTableRow>
                                    <CTableHeaderCell
                                      style={{
                                        backgroundColor: '#57A6A1',
                                        color: 'white',
                                        fontWeight: 'bold',
                                      }}
                                      onClick={toggleSortOrder}
                                    >
                                      <IconButton
                                        className="text-white"
                                        size="small"
                                        onClick={toggleSortOrder}
                                        aria-label="sort"
                                      >
                                        {sortOrder === 'asc' ? (
                                          <ArrowUpwardIcon />
                                        ) : (
                                          <ArrowDownwardIcon />
                                        )}
                                      </IconButton>
                                      Date
                                    </CTableHeaderCell>
                                    <CTableHeaderCell
                                      style={{
                                        backgroundColor: '#57A6A1',
                                        color: 'white',
                                        fontWeight: 'bold',
                                      }}
                                    >
                                      Heure Début
                                    </CTableHeaderCell>
                                    <CTableHeaderCell
                                      style={{
                                        backgroundColor: '#57A6A1',
                                        color: 'white',
                                        fontWeight: 'bold',
                                      }}
                                    >
                                      Heure Fin
                                    </CTableHeaderCell>
                                    <CTableHeaderCell
                                      style={{
                                        backgroundColor: '#57A6A1',
                                        color: 'white',
                                        fontWeight: 'bold',
                                      }}
                                    >
                                      Nom de module
                                    </CTableHeaderCell>
                                    <CTableHeaderCell
                                      style={{
                                        backgroundColor: '#57A6A1',
                                        color: 'white',
                                        fontWeight: 'bold',
                                      }}
                                    >
                                      Nom de groupe
                                    </CTableHeaderCell>
                                  </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                  {seances[key] ? (
                                    seances[key]
                                      .sort((a, b) => {
                                        const dateA = new Date(a.dateSéance)
                                        const dateB = new Date(b.dateSéance)
                                        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA
                                      })
                                      .map((seance) => (
                                        <CTableRow key={seance.id}>
                                          <CTableDataCell scope="row">
                                            {seance.dateSéance}
                                          </CTableDataCell>
                                          <CTableDataCell scope="row">
                                            {seance.heureDébut}
                                          </CTableDataCell>
                                          <CTableDataCell scope="row">
                                            {seance.heureFin}
                                          </CTableDataCell>
                                          <CTableDataCell scope="row">
                                            {seance.module.nomModule}
                                          </CTableDataCell>
                                          <CTableDataCell scope="row">
                                            {seance.groupe.nomGroupe}
                                          </CTableDataCell>
                                        </CTableRow>
                                      ))
                                  ) : (
                                    <CTable className="text-center">
                                      <CTableBody colSpan="4">Aucune séance</CTableBody>
                                    </CTable>
                                  )}
                                </CTableBody>
                              </CTable>
                            </Box>
                          </Collapse>
                        </CTableDataCell>
                      </CTableRow>
                    </React.Fragment>
                  )
                })}
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
