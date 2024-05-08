import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CFormSelect,
  CTable,
  CTableBody,
  CTableCaption,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CPagination,
  CPaginationItem,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
} from '@coreui/react'
import { getStudents } from '../../Actions/BackOfficeActions/ÉtudiantActions'
import AddStudent from './AddÉtudiant'
import { getGroupes } from '../../Actions/BackOfficeActions/GroupeActions'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteTwoTone'
import Fab from '@mui/material/Fab'
import { deleteStudent } from '../../Actions/BackOfficeActions/ÉtudiantActions'
import toast from 'react-hot-toast'
import UpdateÉtudiant from './UpdateÉtudiant'

export default function Étudiant() {
  const [students, setStudents] = useState([])
  const [filteredStudents, setFilteredStudents] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGroupe, setSelectedGroupe] = useState('')
  const [groupes, setGroupes] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)
  const [deleteId, setDeleteId] = useState(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    fetchStudents()
    fetchGroupes()
  }, [])

  useEffect(() => {
    filterStudents()
  }, [students, searchTerm, selectedGroupe, currentPage])
  const fetchGroupes = async () => {
    try {
      const data = await getGroupes()
      setGroupes(data)
    } catch (error) {
      console.error('Error fetching groupes:', error)
    }
  }

  const fetchStudents = async () => {
    try {
      const data = await getStudents()
      setStudents(data)
    } catch (error) {
      console.error('Error fetching students:', error)
    }
  }

  const filterStudents = () => {
    let filtered = students.filter((student) =>
      `${student.nom} ${student.prenom}`.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    if (selectedGroupe) {
      filtered = filtered.filter((student) => student.nomGroupe === selectedGroupe)
    }
    setFilteredStudents(filtered)
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleSelectChange = (e) => {
    setSelectedGroupe(e.target.value)
  }

  const handleDelete = async () => {
    try {
      if (!deleteId) {
        console.error('Error deleting Étudiant: ID is undefined')
        return
      }
      const success = await deleteStudent(deleteId)
      if (success) {
        fetchStudents()
        toast.success('Étudiant supprimé avec succès')
        if (currentItems.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1)
        }
      }
      setDeleteId(null)
    } catch (error) {
      console.error('Error deleting Étudiant:', error)
      toast.error("Échec de la suppression d'étudiant")
    } finally {
      setVisible(false)
    }
  }
  const handleOpenModal = (id) => {
    setDeleteId(id)
    setVisible(true)
  }

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage)

  const hasNextPage = currentPage < totalPages

  const hasPreviousPage = currentPage > 1

  const nextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1)
  }

  const previousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1)
  }

  const startIndex = (currentPage - 1) * itemsPerPage

  const endIndex = startIndex + itemsPerPage

  const currentItems = filteredStudents.slice(startIndex, endIndex)

  return (
    <CCard>
      <CCardBody>
        <div className="container">
          <div className="row mb-4 align-items-center">
            <div className="col-lg-3 mb-3">
              <CCardHeader>
                <h1 className="text-2xl font-bold mb-2">La liste des étudiants</h1>
              </CCardHeader>
            </div>
            <div className="col-lg-5">
              <input
                type="text"
                placeholder="Rechercher par le nom d'étudiant..."
                className="form-control"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <div className="col-lg-3 d-flex justify-content-lg-end mt-3 mt-lg-0">
              <CFormSelect onChange={handleSelectChange} value={selectedGroupe}>
                <option key={null} value="">
                  Sélectionner le groupe
                </option>
                {groupes.map((groupe) => (
                  <option key={groupe.idGroupe} value={groupe.idGroupe}>
                    {groupe.nomGroupe}
                  </option>
                ))}
              </CFormSelect>
            </div>
            <div className="col-lg-1 d-flex justify-content-lg-end mt-3 mt-lg-0">
              <AddStudent fetchStudents={fetchStudents} />
            </div>
          </div>
        </div>
        <CTable striped responsive>
          <CTableCaption>Liste des étudiants</CTableCaption>
          <CTableHead color="dark">
            <CTableRow>
              <CTableHeaderCell scope="col">Nom</CTableHeaderCell>
              <CTableHeaderCell scope="col">Prénom</CTableHeaderCell>
              <CTableHeaderCell scope="col">Adresse</CTableHeaderCell>
              <CTableHeaderCell scope="col">Téléphone</CTableHeaderCell>
              <CTableHeaderCell scope="col">Email</CTableHeaderCell>
              <CTableHeaderCell scope="col">Groupe</CTableHeaderCell>
              <CTableHeaderCell scope="col"></CTableHeaderCell>
              <CTableHeaderCell scope="col"></CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {currentItems.map((student) => (
              <CTableRow key={student.etudiantId}>
                <CTableDataCell>{student.nom}</CTableDataCell>
                <CTableDataCell>{student.prenom}</CTableDataCell>
                <CTableDataCell>{student.adresse}</CTableDataCell>
                <CTableDataCell>{student.telephone}</CTableDataCell>
                <CTableDataCell>{student.email}</CTableDataCell>
                <CTableDataCell>{student.nomGroupe}</CTableDataCell>
                <CTableDataCell>
                  <UpdateÉtudiant student={student} fetchStudents={fetchStudents} />
                </CTableDataCell>
                <CTableDataCell className="ml-1">
                  <Fab
                    style={{ backgroundColor: '#C40C0C', color: 'white' }}
                    size="small"
                    onClick={() => handleOpenModal(student.etudiantId)}
                  >
                    <DeleteOutlinedIcon />
                  </Fab>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
        <div className="d-flex justify-content-center mt-3">
          <CPagination aria-label="Page navigation example">
            <CPaginationItem
              aria-label="Previous"
              onClick={previousPage}
              disabled={!hasPreviousPage}
            >
              <span aria-hidden="true">&laquo;</span>
            </CPaginationItem>
            {Array.from({ length: totalPages }, (_, i) => (
              <CPaginationItem
                key={i}
                active={i + 1 === currentPage}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </CPaginationItem>
            ))}
            <CPaginationItem aria-label="Next" onClick={nextPage} disabled={!hasNextPage}>
              <span aria-hidden="true">&raquo;</span>
            </CPaginationItem>
          </CPagination>
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
        <CModalBody>Êtes-vous sûr de vouloir supprimer cet étudiant ?</CModalBody>
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
