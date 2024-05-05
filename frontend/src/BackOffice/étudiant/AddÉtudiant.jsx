import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { CButton, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter } from '@coreui/react'
import { TextField, MenuItem, Select, Fab } from '@mui/material/'
import AddIcon from '@mui/icons-material/Add'
import { getGroupes } from '../../Actions/BackOfficeActions/GroupeActions'
import { createStudent } from '../../Actions/BackOfficeActions/ÉtudiantActions'
import { toast } from 'react-hot-toast'

export default function AddÉtudiant({ fetchStudents }) {
  const [open, setOpen] = useState(false)
  const [nom, setNom] = useState('')
  const [nomError, setNomError] = useState('')
  const [prenom, setPrenom] = useState('')
  const [prenomError, setPrenomError] = useState('')
  const [adresse, setAdresse] = useState('')
  const [adresseError, setAdresseError] = useState('')
  const [téléphone, setTéléphone] = useState('')
  const [téléphoneError, setTéléphoneError] = useState('')
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [groupeId, setGroupeId] = useState(``)
  const [groupes, setGroupes] = useState([])
  const [groupeNameError, setGroupeNameError] = useState(false)

  useEffect(() => {
    fetchGroupes()
  }, [])

  const fetchGroupes = async () => {
    try {
      const data = await getGroupes()
      setGroupes(data)
    } catch (error) {
      console.error('Error fetching groupes:', error)
    }
  }

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleSaveStudent = async () => {
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
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError(true)
      hasError = true
    }
    if (!groupeId) {
      setGroupeNameError(true)
      hasError = true
    }
    if (hasError) return

    try {
      setOpen(false)
      const confirmed = await showConfirmationDialog()
      if (confirmed) {
        await createStudent({ nom, prenom, adresse, telephone, email, groupeId })
        await fetchStudents()
        toast.success('Étudiant ajouté avec succès')
      }
    } catch (error) {
      console.error('Error creating student:', error)
      toast.error("Erreur lors de l'ajout de l'étudiant")
    }
  }

  return (
    <>
      <Fab size="medium" color="success" onClick={handleOpen}>
        <AddIcon />
      </Fab>
      <CModal
        alignment="center"
        visible={open}
        onClose={handleClose}
        aria-labelledby="staticBackdropLabel"
      >
        <CModalHeader closeButton>
          <CModalTitle id="staticBackdropLabel">Ajouter un nouveau étudiant</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                autoFocus
                error={nomError}
                helperText={nomError && 'Le nom de groupe est requis'}
                margin="dense"
                id="nom"
                name="nom"
                label="Nom d'étudiant"
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
                label="Prénom d'étudiant"
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
                label="Email d'étudiant"
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
                value={groupeId}
                onChange={(e) => {
                  console.log('Selected groupeId:', e.target.value)
                  setGroupeId(e.target.value)
                  setGroupeNameError(false)
                }}
                displayEmpty
                fullWidth
                margin="dense"
                variant="outlined"
                error={groupeNameError}
                placeholder="Sélectionner le groupe"
              >
                <MenuItem value="" disabled>
                  Sélectionner le groupe
                </MenuItem>
                {groupes.map((groupe) => (
                  <MenuItem key={groupe.IdGroupe} value={groupe.IdGroupe}>
                    {groupe.nomGroupe}
                  </MenuItem>
                ))}
              </Select>
            </div>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton
            type="submit"
            onClick={handleSaveStudent}
            variant="outline"
            color="primary"
            style={{
              marginTop: '10px',
              padding: '10px 20px',
              fontSize: '16px',
              fontWeight: 'bold',
              borderRadius: '5px',
              border: '2px solid #007bff',
              color: '#007bff',
              backgroundColor: 'transparent',
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
              borderRadius: '5px',
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

AddÉtudiant.propTypes = {
  fetchStudents: PropTypes.func.isRequired,
}
