import React, { useState } from 'react'
import PropTypes from 'prop-types'
import TextField from '@mui/material/TextField'
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
import { addFacture } from '../../Actions/BackOfficeActions/FactureActions'

export default function AddFiliereDialog({
  selectedProfessor,
  selectedYear,
  selectedMonth,
  totalHours,
}) {
  const [open, setOpen] = useState(false)
  const [montantParHeure, setMontantParHeure] = useState('')
  const [montantParHeureError, setMontantParHeureError] = useState(false)
  const [loading, setLoading] = useState(false)
  const auth = useAuth()
  const accessToken = auth?.user?.access_token

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleSaveInvoice = async () => {
    let hasError = false
    if (!montantParHeure || isNaN(montantParHeure) || parseFloat(montantParHeure) <= 0) {
      setMontantParHeureError(true)
      hasError = true
    } else {
      setMontantParHeureError(false)
    }

    if (hasError) return

    try {
      setLoading(true) // Set loading state to true
      console.log(totalHours)
      const invoiceData = {
        NomProfesseur: selectedProfessor,
        Année: selectedYear,
        Mois: selectedMonth,
        MontantParHeure: parseFloat(montantParHeure),
        TotalHeures: totalHours,
      }
      console.log('Invoice Data:', invoiceData)
      await addFacture(invoiceData, accessToken)
      setOpen(false)
      toast.success('Facture ajoutée avec succès')
    } catch (error) {
      console.error('Error creating invoice:', error)
      toast.error("Erreur lors de l'ajout de la facture")
    } finally {
      setLoading(false) // Reset loading state
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
        Ajouter une facture
      </CButton>
      <CModal
        alignment="center"
        visible={open}
        onClose={handleClose}
        aria-labelledby="StaticBackdropExampleLabel"
      >
        <CModalHeader closeButton>
          <CModalTitle id="StaticBackdropExampleLabel">Ajouter une nouvelle facture</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div>Remplissez les détails pour la nouvelle facture</div>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                autoFocus
                error={montantParHeureError}
                helperText={
                  montantParHeureError
                    ? montantParHeure
                      ? 'Veuillez entrer un montant valide (chiffres uniquement, supérieur à 0)'
                      : 'Le montant est requis'
                    : ''
                }
                margin="dense"
                id="montantParHeure"
                name="MontantParHeure"
                label="Montant par heure"
                type="text"
                fullWidth
                variant="outlined"
                value={montantParHeure}
                onChange={(e) => {
                  setMontantParHeure(e.target.value)
                  setMontantParHeureError(false)
                }}
              />
            </div>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton
            type="submit"
            onClick={handleSaveInvoice}
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
  selectedProfessor: PropTypes.string.isRequired,
  selectedYear: PropTypes.string.isRequired,
  selectedMonth: PropTypes.string.isRequired,
  totalHours: PropTypes.string.isRequired,
}
