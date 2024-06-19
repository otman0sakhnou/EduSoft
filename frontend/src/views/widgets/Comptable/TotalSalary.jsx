import React, { useState, useEffect } from 'react'
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
import { CChartLine } from '@coreui/react-chartjs'
import PropTypes from 'prop-types'

const TotalSalary = ({ getFacture }) => {
  const [timeRange, setTimeRange] = useState({
    startYear: new Date().getFullYear(),
    startMonth: 'janvier',
    endYear: new Date().getFullYear(),
    endMonth: 'décembre',
  })
  const [totalSalary, setTotalSalary] = useState(0)
  const [monthlyTotals, setMonthlyTotals] = useState(Array(12).fill(0))

  useEffect(() => {
    const fetchSalaries = async () => {
      try {
        const factures = await getFacture()
        const filteredFactures = filterFacturesByTimeRange(factures, timeRange)

        const totalSalary = filteredFactures.reduce(
          (sum, facture) => sum + facture.montantTotale,
          0,
        )
        setTotalSalary(totalSalary)
        const monthlyTotals = Array(12).fill(0)
        filteredFactures.forEach((facture) => {
          const monthIndex = getMonthIndex(facture.mois)
          monthlyTotals[monthIndex] += facture.montantTotale
        })
        setMonthlyTotals(monthlyTotals)
      } catch (error) {
        console.error('Error fetching factures:', error)
      }
    }

    fetchSalaries()
  }, [timeRange, getFacture])

  const filterFacturesByTimeRange = (factures, timeRange) => {
    if (
      !timeRange ||
      !timeRange.startYear ||
      !timeRange.startMonth ||
      !timeRange.endYear ||
      !timeRange.endMonth
    ) {
      return []
    }

    const { startYear, startMonth, endYear, endMonth } = timeRange
    const startMonthIndex = getMonthIndex(startMonth)
    const endMonthIndex = getMonthIndex(endMonth)

    return factures.filter((facture) => {
      const factureYear = parseInt(facture.année)
      const factureMonthIndex = getMonthIndex(facture.mois)
      if (
        factureYear > startYear ||
        (factureYear === startYear && factureMonthIndex >= startMonthIndex)
      ) {
        return (
          factureYear < endYear || (factureYear === endYear && factureMonthIndex <= endMonthIndex)
        )
      }

      return false
    })
  }

  const getMonthIndex = (monthName) => {
    const monthNames = [
      'janvier',
      'février',
      'mars',
      'avril',
      'mai',
      'juin',
      'juillet',
      'août',
      'septembre',
      'octobre',
      'novembre',
      'décembre',
    ]
    return monthNames.indexOf(monthName.toLowerCase())
  }

  const handleSelectTimeRange = (range) => {
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const currentMonthIndex = currentDate.getMonth()

    if (range === 'currentYear') {
      setTimeRange({
        startYear: currentYear,
        startMonth: 'janvier',
        endYear: currentYear,
        endMonth: 'décembre',
      })
    } else if (range === 'currentMonth') {
      const currentMonthName = currentDate.toLocaleString('fr-FR', { month: 'long' })
      setTimeRange({
        startYear: currentYear,
        startMonth: currentMonthName,
        endYear: currentYear,
        endMonth: currentMonthName,
      })
    } else if (range === 'last6Months') {
      const pastDate = new Date()
      pastDate.setMonth(pastDate.getMonth() - 5)
      const pastYear = pastDate.getFullYear()
      const pastMonthName = pastDate.toLocaleString('fr-FR', { month: 'long' })
      const currentMonthName = currentDate.toLocaleString('fr-FR', { month: 'long' })

      setTimeRange({
        startYear: pastYear,
        startMonth: pastMonthName,
        endYear: currentYear,
        endMonth: currentMonthName,
      })
    }
  }

  return (
    <CCol>
      <CWidgetStatsA
        className="mb-4"
        style={{ backgroundColor: '#06D001', color: 'white' }}
        value={`DH ${totalSalary.toFixed(2)}`}
        title="Total des Salaires"
        action={
          <CDropdown alignment="end">
            <CDropdownToggle color="transparent" caret={false} className="p-0">
              <CIcon icon={cilOptions} className="text-white" />
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem onClick={() => handleSelectTimeRange('currentYear')}>
                Année Courante
              </CDropdownItem>
              <CDropdownItem onClick={() => handleSelectTimeRange('currentMonth')}>
                Ce Mois
              </CDropdownItem>
              <CDropdownItem onClick={() => handleSelectTimeRange('last6Months')}>
                Derniers 6 Mois
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
        }
        chart={
          <CChartLine
            className="my-2 mx-3"
            style={{ height: '75px' }}
            data={{
              labels: [
                'Janvier',
                'Février',
                'Mars',
                'Avril',
                'Mai',
                'Juin',
                'Juillet',
                'Août',
                'Septembre',
                'Octobre',
                'Novembre',
                'Décembre',
              ],
              datasets: [
                {
                  label: 'Total des Salaires',
                  backgroundColor: 'rgba(255,255,255,.2)',
                  borderColor: 'rgba(255,255,255,.55)',
                  data: monthlyTotals,
                  fill: true,
                },
              ],
            }}
            options={{
              plugins: { legend: { display: false } },
              maintainAspectRatio: false,
              scales: {
                x: {
                  border: { display: false },
                  grid: { display: false, drawBorder: false },
                  ticks: { display: false },
                },
                y: { display: false, grid: { display: false }, ticks: { display: false } },
              },
              elements: {
                line: { borderWidth: 1, tension: 0.4 },
                point: { radius: 0, hitRadius: 10, hoverRadius: 4 },
              },
            }}
          />
        }
      />
    </CCol>
  )
}

TotalSalary.propTypes = {
  getFacture: PropTypes.func.isRequired,
}

export default TotalSalary
