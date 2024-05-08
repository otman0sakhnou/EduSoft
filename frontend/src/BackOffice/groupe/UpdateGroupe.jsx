import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { Fab } from '@mui/material'
import EditIcon from '@mui/icons-material/ModeEditOutlineTwoTone'
import 'react-confirm-alert/src/react-confirm-alert.css'
import { updateGroupe } from '../../Actions/BackOfficeActions/GroupeActions'
import { getFilières } from '../../Actions/BackOfficeActions/FilièreActions'
import { toast } from 'react-hot-toast'
import { CButton, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter } from '@coreui/react'

export default function UpdateGroupeDialog({ groupe, fetchGroupes }) {
  const [open, setOpen] = useState(false)
  const [groupeName, setGroupeName] = useState(groupe.nomGroupe)
  const [filièreId, setFilièreId] = useState(groupe.idFilière)
  const [filières, setFilières] = useState([])
  const [groupeNameError, setGroupeNameError] = useState(false)
  const [filièreError, setFilièreError] = useState(false)

  useEffect(() => {
    fetchFilières()
    setGroupeName(groupe.nomGroupe)
  }, [groupe])

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
      await updateGroupe(groupe.groupeID, { nomGroupe: groupeName, idFilière: filièreId })
      fetchGroupes()
      setOpen(false)
      toast.success('Groupe mis à jour avec succès')
    } catch (error) {
      console.error('Error updating groupe:', error)
      toast.error('Erreur lors de la mise à jour')
    }
  }

  return (
    <>
      <Fab
        style={{ backgroundColor: '#0E46A3', color: 'white' }}
        size="small"
        onClick={handleClickOpen}
      >
        <EditIcon />
      </Fab>
      <CModal visible={open} onClose={handleClose} aria-labelledby="StaticBackdropExampleLabel">
        <CModalHeader closeButton>
          <CModalTitle id="StaticBackdropExampleLabel">Modifier le groupe</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div>Remplissez les détails pour le groupe</div>
          <div className="grid gap-4 py-4">
            <TextField
              autoFocus
              error={groupeNameError}
              helperText={groupeNameError && 'Le nom du groupe est requis'}
              margin="dense"
              id="groupeNanme"
              name="groupeName"
              label="Nom du groupe"
              type="text"
              fullWidth
              variant="outlined"
              value={groupeName}
              onChange={(e) => {
                setGroupeName(e.target.value)
                setGroupeNameError(false)
              }}
            />
            <Select
              value={filièreId || ``}
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
              marginLeft: '10px',
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

UpdateGroupeDialog.propTypes = {
  groupe: PropTypes.object.isRequired,
  fetchGroupes: PropTypes.func.isRequired,
}
