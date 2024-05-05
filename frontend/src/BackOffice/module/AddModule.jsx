import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { CButton, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter } from '@coreui/react'
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { createModule } from '../../Actions/BackOfficeActions/ModuleActions'
import { getFilières } from '../../Actions/BackOfficeActions/FilièreActions'
import { toast } from 'react-hot-toast'
import { Fab } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'

export default function AddModuleDialog({ fetchModules }) {
  const [moduleName, setModuleName] = useState('')
  const [filièreId, setFilièreId] = useState('')
  const [filières, setFilières] = useState([])
  const [moduleNameError, setModuleNameError] = useState(false)
  const [filièreError, setFilièreError] = useState(false)
  const [open, setOpen] = useState(false)

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
  const handleSaveModule = async () => {
    let hasError = false
    if (!moduleName || !/^[A-Za-z\séÉ]+$/.test(moduleName)) {
      setModuleNameError(true)
      hasError = true
    }
    if (!filièreId) {
      setFilièreError(true)
      hasError = true
    }
    if (hasError) return

    try {
      setOpen(false)
      await createModule({ nomModule: moduleName, idFilière: filièreId })
      fetchModules()
      toast.success('Module créé avec succès')
    } catch (error) {
      console.error('Error creating module:', error)
      toast.error('Erreur lors de la création du module')
    }
  }

  return (
    <>
      <Fab size="medium" color="success" onClick={handleClickOpen}>
        <AddIcon />
      </Fab>
      <CModal
        alignment="center"
        visible={open}
        onClose={handleClose}
        aria-labelledby="StaticBackdropExampleLabel"
      >
        <CModalHeader>
          <CModalTitle id="StaticBackdropExampleLabel">Ajouter un nouveau module</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                autoFocus
                error={moduleNameError}
                helperText={
                  moduleNameError
                    ? moduleName
                      ? 'Veuillez entrer un nom valide (lettres uniquement)'
                      : 'Le nom du module est requis'
                    : ''
                }
                margin="dense"
                id="moduleName"
                name="moduleName"
                label="Nom du module"
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
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton
            type="submit"
            onClick={handleSaveModule}
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

AddModuleDialog.propTypes = {
  fetchModules: PropTypes.func.isRequired,
}
