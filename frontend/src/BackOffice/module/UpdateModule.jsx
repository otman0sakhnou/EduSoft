import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import TextField from '@mui/material/TextField'
import makeAnimated from 'react-select/animated'
import Select from 'react-select'
import { updateModule } from '../../Actions/BackOfficeActions/ModuleActions'
import { getFilières } from '../../Actions/BackOfficeActions/FilièreActions'
import { toast } from 'react-hot-toast'
import { CButton, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter } from '@coreui/react'
import EditRounded from '@mui/icons-material/EditRounded'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'

const animatedComponents = makeAnimated()
export default function UpdateModule({ module, fetchModules }) {
  const [open, setOpen] = useState(false)
  const [moduleName, setModuleName] = useState(module.nomModule)
  const [filières, setFilières] = useState([])
  const [selectedFilières, setSelectedFilières] = useState([])
  const [moduleNameError, setModuleNameError] = useState(false)
  const [filièreError, setFilièreError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchFilières()
    setModuleName(module.nomModule)
    setSelectedFilières(
      module.filières.map((filière) => ({
        value: filière.idFilière,
        label: filière.nomFilière,
      })),
    )
  }, [module])

  const fetchFilières = async () => {
    setIsLoading(true)
    try {
      const data = await getFilières()
      setFilières(
        data.map((filière) => ({
          value: filière.idFilière,
          label: filière.nomFilière,
        })),
      )
    } catch (error) {
      console.error('Error fetching filières:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleUpdateModule = async () => {
    let hasError = false
    if (!moduleName) {
      setModuleNameError(true)
      hasError = true
    }
    if (!selectedFilières.length) {
      setFilièreError(true)
      hasError = true
    }
    if (hasError) return
    setIsLoading(true)

    try {
      await updateModule(module.moduleId, {
        nomModule: moduleName,
        FilièreIds: selectedFilières.map((filière) => filière.value),
      })
      fetchModules()
      setOpen(false)
      toast.success('Module mis à jour avec succès')
    } catch (error) {
      fetchModules()
      console.error('Error updating module:', error)
      setOpen(false)
      toast.success('Module mis à jour avec succès')
    } finally {
      setIsLoading(false)
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
              components={animatedComponents}
              value={selectedFilières}
              error={filièreError}
              onChange={(selectedOptions) => {
                setSelectedFilières(selectedOptions)
                setFilièreError(selectedOptions.length === 0)
              }}
              options={filières}
              isMulti
              placeholder="Sélectionner les filières"
              className={filièreError ? 'react-select-error' : ''}
            />
            {filièreError && (
              <span style={{ color: 'red', fontSize: '0.75rem' }}>
                <ErrorOutlineIcon /> Sélectionnez au moins une filière
              </span>
            )}
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
