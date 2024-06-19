import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { CCol, CWidgetStatsA } from '@coreui/react'
import { CChart } from '@coreui/react-chartjs'
import { getStyle } from '@coreui/utils'

const FactureGenerationChart = ({ getFacture }) => {
  const [factures, setFactures] = useState([])
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  })

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
    const processFactures = () => {
      const currentYear = new Date().getFullYear()
      const monthlyTotals = Array(12).fill(0)
      const invoiceCounts = Array(12).fill(0)
      const months = [
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

      factures.forEach((facture) => {
        if (facture.année === currentYear.toString()) {
          const monthIndex = months.indexOf(facture.mois.toLowerCase())
          if (monthIndex !== -1) {
            monthlyTotals[monthIndex] += facture.montantTotale
            invoiceCounts[monthIndex] += 1
          }
        }
      })

      setChartData({
        labels: months.map((month) => month.charAt(0).toUpperCase() + month.slice(1)),
        datasets: [
          {
            label: 'Montant Total des Factures',
            backgroundColor: 'rgb(255, 95, 0)',
            borderColor: 'rgb(255, 95, 0)',
            pointBackgroundColor: 'rgb(255, 95, 0)',
            pointBorderColor: '#fff',
            data: monthlyTotals,
          },
          {
            label: 'Nombre de Factures',
            backgroundColor: 'rgba(75, 192, 192, 1)',
            borderColor: 'rgba(75, 192, 192, 1)',
            pointBackgroundColor: 'rgba(75, 192, 192, 1)',
            pointBorderColor: '#fff',
            data: invoiceCounts,
          },
        ],
      })
    }

    processFactures()
  }, [factures])

  return (
    <CCol xs="12" sm="12" md="6" xl="6" xxl="12">
      <CWidgetStatsA
        className="fw-semibold text-body-secondary text-nowrap shadow-lg"
        title={`Génération de Factures`}
        chart={
          <CChart
            className="px-2"
            type="line"
            data={chartData}
            options={{
              plugins: {
                legend: {
                  labels: {
                    color: getStyle('--cui-body-color'),
                  },
                },
              },
              scales: {
                x: {
                  grid: {
                    color: getStyle('--cui-border-color-translucent'),
                  },
                  ticks: {
                    color: getStyle('--cui-body-color'),
                  },
                },
                y: {
                  grid: {
                    color: getStyle('--cui-border-color-translucent'),
                  },
                  ticks: {
                    color: getStyle('--cui-body-color'),
                  },
                },
              },
            }}
          />
        }
      />
    </CCol>
  )
}

FactureGenerationChart.propTypes = {
  getFacture: PropTypes.func.isRequired,
}

export default FactureGenerationChart
