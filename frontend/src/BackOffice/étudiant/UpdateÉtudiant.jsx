/* eslint-disable react/no-unescaped-entities */
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { CButton, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter } from '@coreui/react'
import { TextField, MenuItem, Select, Fab } from '@mui/material/'
import EditIcon from '@mui/icons-material/ModeEditOutlineTwoTone'
import { updateStudent } from '../../Actions/BackOfficeActions/ÉtudiantActions'
import { toast } from 'react-hot-toast'
import { getGroupes } from '../../Actions/BackOfficeActions/GroupeActions'

export default function UpdateÉtudiant({ student, fetchStudents }) {
  const [open, setOpen] = useState(false)
  const [nom, setNom] = useState(student.nom)
  const [prenom, setPrenom] = useState(student.prenom)
  const [adresse, setAdresse] = useState(student.adresse)
  const [téléphone, setTéléphone] = useState(student.telephone)
  const [email, setEmail] = useState(student.email)
  const [groupes, setGroupes] = useState([])
  const [IdGroupe, setIdGroupe] = useState(student.IdGroupe)
  const [groupeError, setGroupeError] = useState(false)
  const [nomError, setNomError] = useState('')
  const [prenomError, setPrenomError] = useState('')
  const [adresseError, setAdresseError] = useState('')
  const [téléphoneError, setTéléphoneError] = useState('')
  const [emailError, setEmailError] = useState('')

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
  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleUpdateStudent = async () => {
    let hasError = false
    if (!nom) {
      setNomError(true)
      hasError = true
    }
    if (!prenom) {
      setPrenomError(true)
      hasError = true
    }
    if (!adresse) {
      setAdresseError(true)
      hasError = true
    }
    if (!/^\d{10}$/i.test(téléphone)) {
      setTéléphoneError(true)
      hasError = true
    }
    if (!/^0[5-7]\d{8}$/i.test(téléphone)) {
      setTéléphoneError(true)
      hasError = true
    }
    if (!IdGroupe) {
      setGroupeError(true)
      hasError = true
    }
    if (hasError) return
    try {
      await updateStudent(student.etudiantId, {
        nom: nom,
        prenom: prenom,
        adresse: adresse,
        telephone: téléphone,
        email: email,
        IdGroupe: IdGroupe,
      })
      fetchStudents()
      setOpen(false)
      toast.success('étudiant modifé avec succès')
    } catch (error) {
      console.error('Error updating student:', error)
      toast.error("Erreur lors de la mise à jour de l'étudiant")
    }
  }

  return (
    <>
      <Fab size="small" color="primary" onClick={handleOpen}>
        <EditIcon />
      </Fab>
      <CModal visible={open} onClose={handleClose} aria-labelledby="staticBackdropLabel">
        <CModalHeader closeButton>
          <CModalTitle id="staticBackdropLabel">Modifier l'étudiant</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="grid gap-4 py-4">
            <TextField
              error={nomError}
              helperText={nomError && 'Le nom de groupe est requis'}
              autoFocus
              margin="dense"
              id="nom"
              name="nom"
              label="Nom"
              type="text"
              fullWidth
              variant="outlined"
              value={nom}
              onChange={(e) => {
                setNom(e.target.value)
                setNomError(false)
              }}
            />
            <TextField
              error={prenomError}
              helperText={prenomError && "Le prénom d'étudiant est requis"}
              margin="dense"
              id="prenom"
              name="prenom"
              label="Prénom"
              type="text"
              fullWidth
              variant="outlined"
              value={prenom}
              onChange={(e) => {
                setPrenom(e.target.value)
                setPrenomError(false)
              }}
            />
            <TextField
              error={adresseError}
              helperText={adresseError && "L'adresse d'étudiant est requis"}
              margin="dense"
              id="adresse"
              name="adresse"
              label="Adresse"
              type="text"
              fullWidth
              variant="outlined"
              value={adresse}
              onChange={(e) => {
                setAdresse(e.target.value)
                setAdresseError(false)
              }}
            />
            <TextField
              error={téléphoneError}
              helperText={téléphoneError && "Le téléphone d'étudiant est requis (10 chiffres)"}
              margin="dense"
              id="téléphone"
              name="téléphone"
              label="Téléphone"
              type="text"
              fullWidth
              variant="outlined"
              value={téléphone}
              onChange={(e) => {
                setTéléphone(e.target.value)
                setTéléphoneError(false)
              }}
            />
            <TextField
              error={emailError}
              helperText={emailError && "Email d'étudiant est requis (format invalide)"}
              margin="dense"
              id="email"
              name="email"
              label="Email"
              type="text"
              fullWidth
              variant="outlined"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setEmailError(false)
              }}
            />
            <Select
              value={IdGroupe || ``}
              onChange={(e) => {
                setIdGroupe(e.target.value)
                setGroupeError(false)
              }}
              displayEmpty
              fullWidth
              margin="dense"
              variant="outlined"
              error={groupeError}
              placeholder="Sélectionner le groupe"
            >
              <MenuItem value="" disabled>
                Sélectionner le groupe
              </MenuItem>
              {groupes.map((groupe) => (
                <MenuItem key={groupe.groupeID} value={groupe.groupeID}>
                  {groupe.nomGroupe}
                </MenuItem>
              ))}
            </Select>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton
            type="submit"
            onClick={handleUpdateStudent}
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
          >
            Enregistrer
          </CButton>
          <CButton
            onClick={handleClose}
            color="secondary"
            style={{
              marginTop: '10px',
              marginLeft: '10px',
              padding: '10px 20px',
              fontSize: '16px',
              fontWeight: 'bold',
              borderRadius: '10px',
              border: '2px solid #dc3545',
              color: '#dc3545',
              backgroundColor: 'transparent',
              cursor: 'pointer',
            }}
          >
            Annuler
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

UpdateÉtudiant.propTypes = {
  student: PropTypes.object.isRequired,
  fetchStudents: PropTypes.func.isRequired,
}
