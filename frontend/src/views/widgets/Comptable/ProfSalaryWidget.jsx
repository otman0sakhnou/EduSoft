import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import {
  CCol,
  CWidgetStatsA,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilOptions } from '@coreui/icons'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'

const MostPaidProfessorWidget = ({ getFacture }) => {
  const [timeRange, setTimeRange] = useState('ThisYear')
  const [factures, setFactures] = useState([])
  const [topProfessors, setTopProfessors] = useState([])

  useEffect(() => {
    const fetchFactures = async () => {
      try {
        const data = await getFacture()
        setFactures(data)
      } catch (error) {
        console.error('Error fetching factures:', error)
      }
    }

    fetchFactures()
  }, [getFacture])

  useEffect(() => {
    const monthNamesFrench = {
      January: 'janvier',
      February: 'février',
      March: 'mars',
      April: 'avril',
      May: 'mai',
      June: 'juin',
      July: 'juillet',
      August: 'août',
      September: 'septembre',
      October: 'octobre',
      November: 'novembre',
      December: 'décembre',
    }

    const filterFactures = () => {
      const currentDate = new Date()
      let filteredFactures = []

      if (timeRange === 'ThisMonth') {
        const currentMonth =
          monthNamesFrench[currentDate.toLocaleString('default', { month: 'long' })]
        const currentYear = currentDate.getFullYear().toString()
        filteredFactures = factures.filter(
          (facture) => facture.année === currentYear && facture.mois.toLowerCase() === currentMonth,
        )
      } else if (timeRange === 'ThisYear') {
        const currentYear = currentDate.getFullYear().toString()
        filteredFactures = factures.filter((facture) => facture.année === currentYear)
      } else if (timeRange === 'Last6Years') {
        const currentYear = currentDate.getFullYear()
        const startYear = currentYear - 6
        filteredFactures = factures.filter((facture) => {
          const factureYear = parseInt(facture.année, 10)
          return factureYear >= startYear && factureYear <= currentYear
        })
      }

      const topProfessors = filteredFactures
        .reduce((acc, facture) => {
          const existingProf = acc.find((prof) => prof.nomProfesseur === facture.nomProfesseur)
          if (existingProf) {
            existingProf.montantTotale += facture.montantTotale
          } else {
            acc.push({ nomProfesseur: facture.nomProfesseur, montantTotale: facture.montantTotale })
          }
          return acc
        }, [])
        .sort((a, b) => b.montantTotale - a.montantTotale)
        .slice(0, 3)

      setTopProfessors(topProfessors)
    }

    filterFactures()
  }, [factures, timeRange])

  const formattedProfessors = topProfessors.map((professor) => (
    <div
      key={professor.nomProfesseur}
      style={{ display: 'flex', alignItems: 'center', lineHeight: '1.5' }}
    >
      <PersonOutlineIcon className="mr-3" />
      <span style={{ marginLeft: '5px' }}>
        {`${professor.nomProfesseur} : ${professor.montantTotale} DH`}
      </span>
    </div>
  ))

  return (
    <CCol lsm={6} xl={6} xxl={6}>
      <CWidgetStatsA
        className="mb-4"
        style={{ height: '200px', backgroundColor: '#5D3587', color: '#FFFFFF' }}
        title={`Professeurs les mieux payés (${timeRange === 'ThisMonth' ? 'Ce Mois' : timeRange === 'ThisYear' ? 'Cette Année' : '6 Dernières Années'})`}
        value={<div style={{ maxHeight: '150px', overflowY: 'auto' }}>{formattedProfessors}</div>}
        action={
          <CDropdown className="mb-3">
            <CDropdownToggle color="transparent" caret={false} className="p-0">
              <CIcon icon={cilOptions} className="text-white" />
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem onClick={() => setTimeRange('ThisYear')}>Cette Année</CDropdownItem>
              <CDropdownItem onClick={() => setTimeRange('Last6Years')}>
                Les 6 Dernières Années
              </CDropdownItem>
              <CDropdownItem onClick={() => setTimeRange('ThisMonth')}>Ce Mois</CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
        }
      />
    </CCol>
  )
}

MostPaidProfessorWidget.propTypes = {
  getFacture: PropTypes.func.isRequired,
}

export default MostPaidProfessorWidget
