import React, { useState } from 'react'
import PropTypes from 'prop-types'
import TextField from '@mui/material/TextField'
import Fab from '@mui/material/Fab'
import EditIcon from '@mui/icons-material/ModeEditOutlineTwoTone'
import 'react-confirm-alert/src/react-confirm-alert.css'
import { updateFiliere } from '../../Actions/BackOfficeActions/FilièreActions'
import { toast } from 'react-hot-toast'
import { CButton, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter } from '@coreui/react'

export default function UpdateFiliereDialog({ filière, fetchFilières }) {
  const [open, setOpen] = useState(false)
  const [NomFilière, setNomFiliere] = useState(filière.nomFilière)
  const [description, setDescription] = useState(filière.description)
  const [nomFiliereError, setNomFiliereError] = useState(false)
  const [descriptionError, setDescriptionError] = useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleSaveFiliere = async () => {
    let hasError = false
    if (!NomFilière || !/^[A-Za-z\séÉ]+$/.test(NomFilière)) {
      setNomFiliereError(true)
      hasError = true
    }
    if (!description) {
      setDescriptionError(true)
      hasError = true
    }
    if (hasError) return

    try {
      setOpen(false)
      await updateFiliere(filière.idFilière, { NomFilière, description })
      fetchFilières()
      toast.success('Filière mise à jour avec succès')
    } catch (error) {
      console.error('Error updating filiere:', error)
      toast.error('Erreur lors de la mise à jour de la filière')
    }
  }

  return (
    <>
      <Fab
        style={{ backgroundColor: '#0E46A3', color: 'white' }}
        size="small"
        onClick={() => handleClickOpen(filière.idFilièr)}
      >
        <EditIcon />
      </Fab>
      <CModal visible={open} onClose={handleClose} aria-labelledby="StaticBackdropExampleLabel">
        <CModalHeader closeButton>
          <CModalTitle id="StaticBackdropExampleLabel">Modifier la filière</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div>Remplissez les détails pour la filière</div>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                autoFocus
                error={nomFiliereError}
                helperText={
                  nomFiliereError
                    ? NomFilière
                      ? 'Veuillez entrer un nom valide (lettres uniquement)'
                      : 'Le nom de la filière est requis'
                    : ''
                }
                margin="dense"
                id="name"
                name="NomFilière"
                label="Nom de la filière"
                type="text"
                fullWidth
                variant="outlined"
                value={NomFilière}
                onChange={(e) => {
                  setNomFiliere(e.target.value)
                  setNomFiliereError(false)
                }}
              />
              <TextField
                error={descriptionError}
                helperText={
                  descriptionError
                    ? description
                      ? 'Veuillez entrer une description valide (lettres uniquement)'
                      : 'La description de la filière est requise'
                    : ''
                }
                margin="dense"
                id="description"
                name="description"
                label="Description"
                type="text"
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value)
                  setDescriptionError(false)
                }}
              />
            </div>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton
            type="submit"
            onClick={handleSaveFiliere}
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

UpdateFiliereDialog.propTypes = {
  filière: PropTypes.object.isRequired, // Ensure filiere is an object and is required
  fetchFilières: PropTypes.func.isRequired, // Ensure fetchFilières is a function and is required
}
