/* eslint-disable react/no-unescaped-entities */
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableHead,
  CFormSelect,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CRow,
  CCol,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CCardSubtitle,
  CPagination,
  CPaginationItem,
} from '@coreui/react'
import { getStudents } from '../../Actions/BackOfficeActions/ÉtudiantActions'
import { getGroupes } from '../../Actions/BackOfficeActions/GroupeActions'
import AddStudent from './AddÉtudiant'
import UpdateÉtudiant from './UpdateÉtudiant'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import { deleteStudent } from '../../Actions/BackOfficeActions/ÉtudiantActions'
import toast from 'react-hot-toast'
import EmptyFilter from '../../components/EmptyFilters'
import * as XLSX from 'xlsx/xlsx.mjs'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { createStudent } from '../../Actions/BackOfficeActions/ÉtudiantActions'
import BlurOnRoundedIcon from '@mui/icons-material/BlurOnRounded'
import { InputAdornment, TextField } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
export default function ÉtudiantParGroupe() {
  const { nomGroupe } = useParams()
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [groupes, setGroupes] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredStudents, setFilteredStudents] = useState([])
  const [deleteId, setDeleteId] = useState(null)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [confirmImportModalVisible, setConfirmImportModalVisible] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [hasStudents, setHasStudents] = useState(true)
  const [groupeId, setGroupeId] = useState(``)
  const [selectedFile, setSelectedFile] = useState(null)

  useEffect(() => {
    fetchGroupes()
  }, [])
  useEffect(() => {
    fetchStudents()
  }, [nomGroupe])

  useEffect(() => {
    filterStudents()
  }, [students, searchTerm])

  const fetchStudents = async () => {
    try {
      setLoading(true)
      const data = await getStudents()
      const studentsForGroup = data.filter((student) => student.nomGroupe === nomGroupe)
      if (studentsForGroup.length > 0) {
        setStudents(studentsForGroup)
        setHasStudents(true)
      } else {
        setHasStudents(false)
      }
      setLoading(false)
    } catch (error) {
      console.error('Error fetching students:', error)
      setError(error.message || 'An error occurred while fetching students')
      setLoading(false)
    }
  }
  const fetchGroupes = async () => {
    try {
      const data = await getGroupes()
      setGroupes(data)
    } catch (error) {
      console.error('Error fetching groupes:', error)
    }
  }
  const handleSelectChange = (e) => {
    setGroupeId(e.target.value)
  }
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0])
  }

  const filterStudents = () => {
    let filtered = students.filter(
      (student) =>
        student.nomGroupe === nomGroupe &&
        `${student.nom} ${student.prenom}`.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredStudents(filtered)
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }
  const handleUpload = async () => {
    if (!groupeId) {
      toast.error('Veuillez sélectionner un groupue')
      return
    }
    if (!selectedFile) {
      toast.error('Veuillez sélectionner un fichier Excel')
      return
    }

    const fileReader = new FileReader()
    fileReader.onload = async (e) => {
      const data = new Uint8Array(e.target.result)
      const workbook = XLSX.read(data, { type: 'array' })
      const sheetName = workbook.SheetNames[0]
      const sheet = workbook.Sheets[sheetName]
      const expectedColumnNames = [
        'cne',
        'cin',
        'nom',
        'prenom',
        'adresse',
        'telephone',
        'email',
        'dateDeNaissance',
        'lieuDeNaissance',
      ]
      const columnNames = XLSX.utils.sheet_to_json(sheet, { header: 1 })[0]
      const isValidColumns = expectedColumnNames.every((name) => columnNames.includes(name))
      if (!isValidColumns) {
        toast.error('Les noms de colonnes dans le fichier Excel ne correspondent pas.')
        return
      }

      const excelData = XLSX.utils.sheet_to_json(sheet)

      let validationErrors = []
      let validatedStudents = []

      for (const student of excelData) {
        if (
          Object.values(student).some(
            (value) => value === null || value === undefined || value === '',
          )
        ) {
          validationErrors.push("Les données de l'étudiant dans le fichier Excel sont incomplètes.")
          continue
        }

        const dobExcel = student.dateDeNaissance
        const dobJSDate = XLSX.SSF.parse_date_code(dobExcel)
        const dateDeNaissance = new Date(dobJSDate.y, dobJSDate.m - 1, dobJSDate.d)
        const dateDeNaissanceString = dateDeNaissance.toISOString().split('T')[0]

        const telephoneRegex =
          /^(?:(?:(?:\+|00)212[\s]?(?:[\s]?\(0\)[\s]?)?)|0){1}(?:5[\s.-]?[2-3]|6[\s.-]?[13-9]|7[\s.-]?[13-9]|8[\s.-]?[13-9]){1}[0-9]{1}(?:[\s.-]?\d{2}){3}$/
        if (!telephoneRegex.test(student.telephone)) {
          validationErrors.push(
            `Le téléphone doit être valide pour l'étudiant ${student.nom} ${student.prenom}.`,
          )
          continue
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(student.email)) {
          validationErrors.push(
            `L'email doit être valide pour l'étudiant ${student.nom} ${student.prenom}.`,
          )
          continue
        }

        const dateRegex = /^\d{4}-\d{2}-\d{2}$/
        if (!dateRegex.test(dateDeNaissanceString)) {
          validationErrors.push(
            `La date de naissance doit être au format AAAA-MM-JJ pour l'étudiant ${student.nom} ${student.prenom}.`,
          )
          continue
        }
        validatedStudents.push({
          cne: student.cne,
          cin: student.cin,
          nom: student.nom,
          prenom: student.prenom,
          adresse: student.adresse,
          telephone: student.telephone,
          email: student.email,
          dateDeNaissance: dateDeNaissanceString,
          lieuDeNaissance: student.lieuDeNaissance,
        })
      }

      if (validationErrors.length > 0) {
        validationErrors.forEach((error) => toast.error(error))
        return
      }
      try {
        setLoading(true)
        for (const student of validatedStudents) {
          await createStudent({
            ...student,
            idGroupe: groupeId,
          })
        }
        setLoading(false)
        toast.success('Les étudiants ont été importés avec succès.')
        fetchStudents()
      } catch (error) {
        console.error('Error creating students:', error)
        toast.error("Une erreur s'est produite lors de l'importation des étudiants.")
        setLoading(false)
      }
    }

    fileReader.readAsArrayBuffer(selectedFile)
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
      setDeleteModalVisible(false)
    }
  }
  const handleOpenModal = () => {
    setConfirmImportModalVisible(true)
  }
  const handleOpenModalDelete = (id) => {
    setDeleteId(id)
    setDeleteModalVisible(true)
  }
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredStudents.slice(indexOfFirstItem, indexOfLastItem)
  const hasNextPage = currentPage < Math.ceil(filteredStudents.length / itemsPerPage)
  const hasPreviousPage = currentPage > 1
  return (
    <>
      <CCard className="container mx-auto my-8 pt-3 px-4 sm:px-6 lg:px-8 shadow-lg">
        <CCardHeader
          style={{
            backgroundColor: '#e9ecef',
            padding: '0.75rem 1.25rem',
            borderBottom: '1px solid #dee2e6',
            borderRadius: '12px 12px 0 0',
          }}
        >
          <CRow className="align-items-center mt-2">
            <CCol>
              <h2
                style={{
                  fontWeight: 'bold',
                  color: '#343a40',
                }}
                className="mb-2 mx-3"
              >
                La liste des étudiants de {nomGroupe}
              </h2>
            </CCol>
            <CCol>
              <TextField
                type="text"
                placeholder="Rechercher par le nom d'étudiant"
                className="form-control"
                value={searchTerm}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </CCol>
          </CRow>
        </CCardHeader>
        <CRow className="mt-3 pr-5">
          <div className="text-end ">
            <AddStudent fetchStudents={fetchStudents} />
          </div>
        </CRow>
        <CCardBody>
          {hasStudents ? (
            <CTable
              align="middle"
              className="mb-0 border text-center"
              bordered
              responsive
              small
              hover
            >
              <CTableHead className="text-nowrap">
                <CTableRow>
                  <CTableHeaderCell
                    style={{ backgroundColor: '#57A6A1', color: 'white' }}
                    scope="col"
                  >
                    CNE
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    style={{ backgroundColor: '#57A6A1', color: 'white', fontWeight: 'bold' }}
                    scope="col"
                  >
                    CIN
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    style={{ backgroundColor: '#57A6A1', color: 'white', fontWeight: 'bold' }}
                    scope="col"
                  >
                    Nom
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    style={{ backgroundColor: '#57A6A1', color: 'white', fontWeight: 'bold' }}
                    scope="col"
                  >
                    Prénom
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    style={{ backgroundColor: '#57A6A1', color: 'white', fontWeight: 'bold' }}
                    scope="col"
                    xs
                  >
                    Date de naissance
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    style={{ backgroundColor: '#57A6A1', color: 'white', fontWeight: 'bold' }}
                    scope="col"
                    xs
                  >
                    Lieu de naissance
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    style={{ backgroundColor: '#57A6A1', color: 'white', fontWeight: 'bold' }}
                    scope="col"
                  >
                    Adresse
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    style={{ backgroundColor: '#57A6A1', color: 'white', fontWeight: 'bold' }}
                    scope="col"
                  >
                    Téléphone
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    style={{ backgroundColor: '#57A6A1', color: 'white', fontWeight: 'bold' }}
                    scope="col"
                  >
                    Email
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    style={{ backgroundColor: '#57A6A1', color: 'white', fontWeight: 'bold' }}
                  >
                    <BlurOnRoundedIcon sx={{ fontSize: 32 }} />
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {currentItems.map((student) => (
                  <CTableRow key={student.etudiantId}>
                    <CTableDataCell style={{ fontWeight: 'bold' }}>{student.cne}</CTableDataCell>
                    <CTableDataCell style={{ fontWeight: 'bold' }}>{student.cin}</CTableDataCell>
                    <CTableDataCell style={{ fontWeight: 'bold' }}>{student.nom}</CTableDataCell>
                    <CTableDataCell style={{ fontWeight: 'bold' }}>{student.prenom}</CTableDataCell>
                    <CTableDataCell style={{ fontWeight: 'bold' }}>
                      {student.dateDeNaissance}
                    </CTableDataCell>
                    <CTableDataCell style={{ fontWeight: 'bold' }}>
                      {student.lieuDeNaissance}
                    </CTableDataCell>
                    <CTableDataCell style={{ fontWeight: 'bold' }}>
                      {student.adresse}
                    </CTableDataCell>
                    <CTableDataCell style={{ fontWeight: 'bold' }}>
                      {student.telephone}
                    </CTableDataCell>
                    <CTableDataCell style={{ fontWeight: 'bold' }}>{student.email}</CTableDataCell>
                    <CTableDataCell
                      colSpan={2}
                      style={{ fontWeight: 'bold' }}
                      className="col-sm-1 text-center"
                    >
                      <UpdateÉtudiant student={student} fetchStudents={fetchStudents} />
                      <DeleteRoundedIcon
                        sx={{ fontSize: 30 }}
                        onClick={() => handleOpenModalDelete(student.etudiantId)}
                        color="error"
                      />
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          ) : (
            <div className="text-center">
              <EmptyFilter
                title="Aucun étudiant trouvé pour ce groupe"
                subtitle="Essayez d'ajouter des étudiants à ce groupe"
              />
            </div>
          )}
          <div className="d-flex justify-content-center mt-3">
            <CPagination aria-label="Page navigation example">
              <CPaginationItem
                aria-label="Previous"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={!hasPreviousPage}
              >
                <span aria-hidden="true">&laquo;</span>
              </CPaginationItem>
              {Array.from(
                { length: Math.ceil(filteredStudents.length / itemsPerPage) },
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
        </CCardBody>
      </CCard>
      <div className="mt-4"></div>
      <CCard className="mb-4"></CCard>
      <CCard className="items-center text-center shadow-lg mt-10">
        <CCardHeader>
          <h4>Importer des étudiants</h4>
        </CCardHeader>
        <CCardBody></CCardBody>
        <CCardSubtitle className="mb-3 text-body-secondary">
          Téléchargez un fichier Excel pour importer les données des étudiants et les associer à un
          groupe.
        </CCardSubtitle>
        <div className="mb-5 mx-auto" style={{ width: '18rem' }}>
          <CRow className="g-3">
            <CCol md={12}>
              <CFormSelect onChange={handleSelectChange} value={groupeId}>
                <option key={null} value="">
                  Sélectionner le groupe
                </option>
                {groupes.map((groupe) => (
                  <option key={groupe.groupeID} value={groupe.groupeID}>
                    {groupe.nomGroupe}
                  </option>
                ))}
              </CFormSelect>
            </CCol>
            <CCol md={12}>
              <CCard className="text-center" style={{ border: '2px dashed #ccc' }}>
                <CCardBody>
                  <input
                    type="file"
                    accept=".xls, .xlsx"
                    style={{ display: 'none' }}
                    id="fileInput"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="fileInput">
                    <CloudUploadIcon className="h-8 w-8" />
                    <p>Cliquez pour télécharger un fichier Excel</p>
                  </label>
                </CCardBody>
              </CCard>
            </CCol>
            <CCol>
              <CButton
                onClick={handleOpenModal}
                shape="rounded-pill"
                style={{
                  backgroundColor: '#4CCD99',
                  marginTop: '10px',
                  padding: '10px 30px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  color: 'white',
                }}
              >
                Ajouter ces étudiants
              </CButton>
            </CCol>
          </CRow>
        </div>
      </CCard>
      <CModal
        backdrop="static"
        visible={confirmImportModalVisible}
        onClose={() => setConfirmImportModalVisible(false)}
        aria-labelledby="StaticBackdropExampleLabel"
      >
        <CModalHeader closeButton>
          <CModalTitle id="StaticBackdropExampleLabel">Confirmation</CModalTitle>
        </CModalHeader>
        <CModalBody>Vous Êtes sûr d'ajouter les étudiants sélectionnés ?</CModalBody>
        <CModalFooter>
          <CButton
            shape="rounded-pill"
            style={{
              marginTop: '10px',
              padding: '10px 30px',
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#ffffff',
              backgroundColor: '#007bff',
              cursor: 'pointer',
            }}
            onClick={() => {
              handleUpload()
              setConfirmImportModalVisible(false)
            }}
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
              cursor: 'pointer',
            }}
            onClick={() => setConfirmImportModalVisible(false)}
          >
            Annuler
          </CButton>
        </CModalFooter>
      </CModal>
      <CModal
        backdrop="static"
        visible={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        aria-labelledby="StaticBackdropExampleLabel"
      >
        <CModalHeader closeButton>
          <CModalTitle id="StaticBackdropExampleLabel">Confirmation</CModalTitle>
        </CModalHeader>
        <CModalBody>Êtes-vous sûr de vouloir supprimer cet étudiant ?</CModalBody>
        <CModalFooter>
          <CButton
            shape="rounded-pill"
            style={{
              marginTop: '10px',
              padding: '10px 30px',
              fontSize: '16px',
              fontWeight: 'bold',
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
              border: '2px solid #dc3545',
              color: '#dc3545',
              cursor: 'pointer',
            }}
            onClick={() => setDeleteModalVisible(false)}
          >
            Annuler
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}
