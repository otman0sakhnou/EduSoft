import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { Fab } from '@mui/material'
import EditIcon from '@mui/icons-material/ModeEditOutlineTwoTone'
import { updateModule } from '../../Actions/BackOfficeActions/ModuleActions'
import { getFilières } from '../../Actions/BackOfficeActions/FilièreActions'
import { toast } from 'react-hot-toast'
import { CButton, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter } from '@coreui/react'
import EditRounded from '@mui/icons-material/EditRounded'

export default function UpdateModule({ module, fetchModules }) {
  const [open, setOpen] = useState(false)
  const [moduleName, setModuleName] = useState(module.nomModule)
  const [filièreId, setFilièreId] = useState(module.idFilière)
  const [filières, setFilières] = useState([])
  const [moduleNameError, setModuleNameError] = useState(false)
  const [filièreError, setFilièreError] = useState(false)

  useEffect(() => {
    fetchFilières()
    setModuleName(module.nomModule)
  }, [module])

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

  const handleUpdateModule = async () => {
    console.log('handleUpdateModule called')
    let hasError = false
    if (!moduleName) {
      setModuleNameError(true)
      hasError = true
    }
    if (!filièreId) {
      setFilièreError(true)
      hasError = true
    }
    if (hasError) return

    try {
      console.log('ID :', filièreId)
      console.log('ID M:', module.moduleId)
      console.log('NOM :', moduleName)
      await updateModule(module.moduleId, { nomModule: moduleName, idFilière: filièreId })
      fetchModules()
      setOpen(false)
      toast.success('Module mis à jour avec succès')
    } catch (error) {
      console.error('Error updating module:', error)
      toast.error('Erreur lors de la mise à jour')
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
          <CModalTitle id="StaticBackdropExampleLabel">Modifier le Module</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div>Remplissez les détails pour le Module</div>
          <div className="grid gap-4 py-4">
            <TextField
              autoFocus
              error={moduleNameError}
              helperText={moduleNameError && 'Le nom de module est requis'}
              margin="dense"
              id="moduleName"
              name="moduleName"
              label="Nom de Module"
              type="text"
              fullWidth
              variant="outlined"
              value={moduleName}
              onChange={(e) => {
                setModuleName(e.target.value)
                setModuleNameError(false)
              }}
            />
            <Select
              value={filièreId || ''}
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
            onClick={handleUpdateModule}
            shape="rounded-pill"
            style={{
              marginTop: '10px',
              padding: '10px 30px',
              fontSize: '16px',
              fontWeight: 'bold',
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
            shape="rounded-pill"
            style={{
              marginTop: '10px',
              marginLeft: '10px',
              padding: '10px 20px',
              fontSize: '16px',
              fontWeight: 'bold',
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

UpdateModule.propTypes = {
  module: PropTypes.object.isRequired,
  fetchModules: PropTypes.func.isRequired,
}
