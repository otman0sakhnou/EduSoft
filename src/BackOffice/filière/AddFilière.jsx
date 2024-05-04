import React, { useState } from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import CIcon from '@coreui/icons-react'
import { cilPlus } from '@coreui/icons'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'
import { createFiliere } from '../../Actions/BackOfficeActions/FilièreActions'

export default function AddFiliereDialog() {
  const [open, setOpen] = useState(false)
  const [NomFilière, setNomFiliere] = useState('')
  const [description, setDescription] = useState('')
  const [nomFiliereError, setNomFiliereError] = useState(false)
  const [descriptionError, setDescriptionError] = useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const showConfirmationDialog = () => {
    return new Promise((resolve, reject) => {
      confirmAlert({
        title: 'Confirm Action',
        message: 'Êtes-vous sûr de vouloir créer cette filière ?',
        buttons: [
          {
            label: 'Oui',
            onClick: () => resolve(true),
          },
          {
            label: 'Annuler',
            onClick: () => reject(false),
          },
        ],
      })
    })
  }

  const handleSaveFiliere = async () => {
    let hasError = false
    if (!NomFilière) {
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
      const confirmed = await showConfirmationDialog()
      if (confirmed) {
        await createFiliere({ NomFilière, description })
      }
    } catch (error) {
      console.error('Error creating filiere:', error)
    }
  }

  return (
    <>
      <Button variant="outlined" color="success" onClick={handleClickOpen}>
        <CIcon icon={cilPlus} />
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault()
            handleSaveFiliere()
          },
        }}
      >
        <DialogTitle className="text-2xl font-bold mb-2">Ajouter une nouvelle filiere</DialogTitle>
        <DialogContent>
          <DialogContentText>Remplissez les détails pour la nouvelle filière.</DialogContentText>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                autoFocus
                error={nomFiliereError}
                helperText={nomFiliereError && 'Nom du Filière est requis'}
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
                helperText={descriptionError && 'Description est requise'}
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Annuler
          </Button>
          <Button type="submit" onClick={handleSaveFiliere} color="primary">
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
