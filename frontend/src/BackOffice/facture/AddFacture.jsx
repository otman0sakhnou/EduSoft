import React, { useState } from 'react'
import PropTypes from 'prop-types'
import TextField from '@mui/material/TextField'
import { toast } from 'react-hot-toast'
import { CButton, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter } from '@coreui/react'
import { useAuth } from 'react-oidc-context'
import { addFacture } from '../../Actions/BackOfficeActions/FactureActions' // Adjust import as needed

export default function AddFiliereDialog({ selectedProfessor, selectedMonth, totalHours }) {
  const [open, setOpen] = useState(false)
  const [montantParHeure, setMontantParHeure] = useState('')
  const [montantParHeureError, setMontantParHeureError] = useState(false)
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
      setOpen(false)
      await addFacture(
        {
          NomProfesseur: selectedProfessor,
          Mois: selectedMonth,
          MontantParHeure: parseFloat(montantParHeure),
          TotalHeures: totalHours,
        },
        accessToken,
      )
      toast.success('Facture ajoutée avec succès')
    } catch (error) {
      console.error('Error creating invoice:', error)
      toast.error("Erreur lors de l'ajout de la facture")
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
  selectedMonth: PropTypes.string.isRequired,
  totalHours: PropTypes.number.isRequired,
}
