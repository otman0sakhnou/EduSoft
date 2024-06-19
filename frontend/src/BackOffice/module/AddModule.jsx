import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import {
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CSpinner,
} from '@coreui/react'
import TextField from '@mui/material/TextField'
import { createModule } from '../../Actions/BackOfficeActions/ModuleActions'
import { getFilières } from '../../Actions/BackOfficeActions/FilièreActions'
import { toast } from 'react-hot-toast'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'

const animatedComponents = makeAnimated()

export default function AddModuleDialog({ fetchModules }) {
  const [moduleName, setModuleName] = useState('')
  const [filièreIds, setFilièreIds] = useState([])
  const [filières, setFilières] = useState([])
  const [moduleNameError, setModuleNameError] = useState(false)
  const [filièreError, setFilièreError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false)
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

  const handleSaveModule = async () => {
    let hasError = false
    if (!moduleName) {
      setModuleNameError(true)
      hasError = true
    }
    if (filièreIds.length === 0) {
      setFilièreError(true)
      hasError = true
    }
    if (hasError) return

    try {
      setLoading(true)
      await createModule({ nomModule: moduleName, FilièreIds: filièreIds })
      fetchModules()
      setLoading(false)
      setOpen(false)
      toast.success('Module créé avec succès')
    } catch (error) {
      console.error('Error creating module:', error)
      toast.error('Erreur lors de la création du module')
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
        Ajouter un module
      </CButton>
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
          <div>Remplissez les détails pour le nouveau module</div>
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
                className="mb-3"
                variant="outlined"
                value={moduleName}
                onChange={(e) => {
                  setModuleName(e.target.value)
                  setModuleNameError(false)
                }}
              />
              <Select
                closeMenuOnSelect={false}
                components={animatedComponents}
                isMulti
                error={filièreError}
                placeholder="Sélectionner la filière"
                isLoading={isLoading}
                onChange={(selectedOptions) => {
                  setFilièreIds(selectedOptions.map((option) => option.value))
                  setFilièreError(selectedOptions.length === 0)
                }}
                options={filières.map((filière) => ({
                  value: filière.idFilière,
                  label: filière.nomFilière,
                }))}
              />
              {filièreError && (
                <span style={{ color: 'red', fontSize: '0.75rem' }}>
                  <ErrorOutlineIcon /> Sélectionnez au moins une filière.
                </span>
              )}
            </div>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton
            type="submit"
            onClick={handleSaveModule}
            shape="rounded-pill"
            style={{
              marginTop: '10px',
              padding: '10px 30px',
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

AddModuleDialog.propTypes = {
  fetchModules: PropTypes.func.isRequired,
}
