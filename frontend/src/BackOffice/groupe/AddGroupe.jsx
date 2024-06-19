import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { Fab } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import 'react-confirm-alert/src/react-confirm-alert.css'
import { createGroupe } from '../../Actions/BackOfficeActions/GroupeActions'
import { getFilières } from '../../Actions/BackOfficeActions/FilièreActions'
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

export default function AddGroupeDialog({ fetchGroupe }) {
  const [open, setOpen] = useState(false)
  const [groupeName, setGroupeName] = useState('')
  const [filièreId, setFilièreId] = useState('')
  const [filières, setFilières] = useState([])
  const [groupeNameError, setGroupeNameError] = useState(false)
  const [filièreError, setFilièreError] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchFilières()
  }, [])

  const fetchFilières = async () => {
    try {
      const data = await getFilières()
      setFilières(data)
    } catch (error) {
      console.error('Error fetching filières:', error)
    }
  }

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleSaveGroupe = async () => {
    let hasError = false
    if (!groupeName) {
      setGroupeNameError(true)
      hasError = true
    }
    if (!filièreId) {
      setFilièreError(true)
      hasError = true
    }
    if (hasError) return

    try {
      setLoading(true)
      await createGroupe({ nomGroupe: groupeName, idFilière: filièreId })
      await fetchGroupe()
      toast.success('Groupe ajouté avec succès')
      setLoading(false)
      setOpen(false)
    } catch (error) {
      console.error('Error creating groupe:', error)
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
        Ajouter un groupe
      </CButton>
      <CModal
        alignment="center"
        visible={open}
        onClose={handleClose}
        aria-labelledby="StaticBackdropExampleLabel"
      >
        <CModalHeader closeButton>
          <CModalTitle id="StaticBackdropExampleLabel">Ajouter un nouveau groupe</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div>Remplissez les détails pour le nouveau groupe</div>
          <div className="grid gap-4 py-4">
            <TextField
              autoFocus
              error={groupeNameError}
              helperText={groupeNameError && 'Le nom de groupe est requis'}
              margin="dense"
              id="groupeNanme"
              name="groupeName"
              label="Nom du groupe"
              type="text"
              fullWidth
              className="mb-3"
              variant="outlined"
              value={groupeName}
              onChange={(e) => {
                setGroupeName(e.target.value)
                setGroupeNameError(false)
              }}
            />
            <Select
              value={filièreId}
              onChange={(e) => {
                setFilièreId(e.target.value)
                setFilièreError(false)
              }}
              displayEmpty
              fullWidth
              margin="dense"
              variant="outlined"
              error={filièreError}
              placeholder="Sélectionner la filière"
            >
              <MenuItem value="" disabled>
                Sélectionner la filière
              </MenuItem>
              {filières.map((filière) => (
                <MenuItem key={filière.idFilière} value={filière.idFilière}>
                  {filière.nomFilière}
                </MenuItem>
              ))}
            </Select>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton
            type="submit"
            onClick={handleSaveGroupe}
            variant="outline"
            color="primary"
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
            color="secondary"
            style={{
              marginTop: '10px',
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
AddGroupeDialog.propTypes = {
  fetchGroupe: PropTypes.func.isRequired,
}