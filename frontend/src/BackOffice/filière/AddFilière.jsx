import React, { useState } from 'react'
import PropTypes from 'prop-types'
import TextField from '@mui/material/TextField'
import 'react-confirm-alert/src/react-confirm-alert.css'
import { createFiliere } from '../../Actions/BackOfficeActions/FilièreActions'
import { toast } from 'react-hot-toast'
import {
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CSpinner,
} from '@coreui/react'
import { useAuth } from 'react-oidc-context'

export default function AddFiliereDialog({ fetchFilières }) {
  const [open, setOpen] = useState(false)
  const [NomFilière, setNomFiliere] = useState('')
  const [description, setDescription] = useState('')
  const [nomFiliereError, setNomFiliereError] = useState(false)
  const [descriptionError, setDescriptionError] = useState(false)
  const [loading, setLoading] = useState(false)
  const auth = useAuth()
  const accessToken = auth?.user?.access_token

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
      await createFiliere({ NomFilière, description }, accessToken)
      fetchFilières()
      toast.success('Filière ajouté avec succès')
      setLoading(false)
      setOpen(false)
    } catch (error) {
      console.error('Error creating filiere:', error)
      toast.error("Erreur lors de l'ajout")
    }
  }

  return (
    <>
      <CButton
        onClick={handleClickOpen}
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
        Ajouter une filiére
      </CButton>
      <CModal
        alignment="center"
        visible={open}
        onClose={handleClose}
        aria-labelledby="StaticBackdropExampleLabel"
      >
        <CModalHeader closeButton>
          <CModalTitle id="StaticBackdropExampleLabel">Ajouter une nouvelle Filière</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div>Remplissez les détails pour la nouvelle filière</div>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                autoFocus
                error={nomFiliereError}
                helperText={
                  nomFiliereError
                    ? NomFilière
                      ? 'Veuillez entrer un nom valide (lettres uniquement)'
                      : 'Le nom du filière est requis'
                    : ''
                }
                margin="dense"
                id="name"
                name="NomFilière"
                label="Nom du Filière"
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
                      : 'Le nom du filière est requis'
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
AddFiliereDialog.propTypes = {
  fetchFilières: PropTypes.func.isRequired,
}
