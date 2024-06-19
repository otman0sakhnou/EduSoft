import React, { useState } from 'react'
import PropTypes from 'prop-types'
import TextField from '@mui/material/TextField'
import Fab from '@mui/material/Fab'
import EditIcon from '@mui/icons-material/ModeEditOutlineTwoTone'
import { updateFiliere } from '../../Actions/BackOfficeActions/FilièreActions'
import { toast } from 'react-hot-toast'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CSpinner,
} from '@coreui/react'
import EditRounded from '@mui/icons-material/EditRounded'

export default function UpdateFiliereDialog({ filière, fetchFilières }) {
  const [open, setOpen] = useState(false)
  const [NomFilière, setNomFiliere] = useState(filière.nomFilière)
  const [description, setDescription] = useState(filière.description)
  const [nomFiliereError, setNomFiliereError] = useState(false)
  const [descriptionError, setDescriptionError] = useState(false)
  const [loading, setLoading] = useState(false)

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
      setLoading(true)
      await updateFiliere(filière.idFilière, { NomFilière, description })
      fetchFilières()
      setLoading(false)
      setOpen(false)
      toast.success('Filière mise à jour avec succès')
    } catch (error) {
      console.error('Error updating filiere:', error)
      toast.error('Erreur lors de la mise à jour de la filière')
    }
  }

  return (
    <>
      <EditRounded
        sx={{ fontSize: 30 }}
        className="mx-3"
        color="primary"
        onClick={handleClickOpen}
      />
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
            shape="rounded-pill"
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
            disabled={loading}
          >
            {loading ? (
              <CSpinner as="span" size="sm" variant="grow" aria-hidden="true" />
            ) : (
              'Enregistrer'
            )}
          </CButton>
          <CButton
            onClick={handleClose}
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
          >
            Annuler
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

UpdateFiliereDialog.propTypes = {
  filière: PropTypes.object.isRequired,
  fetchFilières: PropTypes.func.isRequired,
}
