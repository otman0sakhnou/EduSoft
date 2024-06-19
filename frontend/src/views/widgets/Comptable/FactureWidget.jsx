import React, { useState, useEffect } from 'react'
import {
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CCol,
  CWidgetStatsA,
} from '@coreui/react'
import { CChartLine } from '@coreui/react-chartjs'
import PropTypes from 'prop-types'
import CIcon from '@coreui/icons-react'
import { cilOptions, cilArrowTop, cilArrowBottom } from '@coreui/icons'
import { getStyle } from '@coreui/utils'

function FactureWidget({ getFacture }) {
  const [invoices, setInvoices] = useState([])
  const [selectedTimeRange, setSelectedTimeRange] = useState('ThisYear')
  const [monthlyInvoiceCounts, setMonthlyInvoiceCounts] = useState([])
  const [totalInvoices, setTotalInvoices] = useState(0)
  const [percentageChange, setPercentageChange] = useState(100)

  useEffect(() => {
    async function fetchInvoices() {
      try {
        const data = await getFacture()
        setInvoices(data)
      } catch (error) {
        console.error('Error fetching invoices:', error)
      }
    }
    fetchInvoices()
  }, [getFacture])

  useEffect(() => {
    const currentYear = new Date().getFullYear()
    const currentMonthIndex = new Date().getMonth()
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
    const monthlyCounts = Array(12).fill(0)
    let total = 0

    invoices.forEach((invoice) => {
      const invoiceYear = parseInt(invoice.année, 10)
      const invoiceMonth = invoice.mois?.toLowerCase()
      const monthIndex = months.indexOf(invoiceMonth)

      if (invoiceYear === currentYear) {
        if (selectedTimeRange === 'ThisYear') {
          if (monthIndex <= currentMonthIndex) {
            monthlyCounts[monthIndex]++
            total++
          }
        } else if (selectedTimeRange === 'Last6Months') {
          const startIndex =
            currentMonthIndex - 5 >= 0 ? currentMonthIndex - 5 : 12 + (currentMonthIndex - 5)
          if (
            (monthIndex <= currentMonthIndex && monthIndex >= startIndex) ||
            (startIndex < 0 && (monthIndex <= currentMonthIndex || monthIndex >= startIndex + 12))
          ) {
            monthlyCounts[monthIndex]++
            total++
          }
        }
      }
    })

    setMonthlyInvoiceCounts(monthlyCounts)
    setTotalInvoices(total)
  }, [invoices, selectedTimeRange])

  useEffect(() => {
    const previousTotalInvoices = monthlyInvoiceCounts.reduce((acc, count) => acc + count, 0)
    const change =
      previousTotalInvoices !== 0
        ? ((totalInvoices - previousTotalInvoices) / previousTotalInvoices) * 100
        : 100
    setPercentageChange(change)
  }, [totalInvoices, monthlyInvoiceCounts])

  return (
    <CCol>
      <CWidgetStatsA
        className="mb-4"
        style={{ backgroundColor: '#6FDCE3', color: 'white' }}
        value={
          <>
            {totalInvoices}{' '}
            {totalInvoices !== 0 && (
              <span className="fs-6 fw-normal">
                ({percentageChange.toFixed(1)}%{' '}
                <CIcon icon={percentageChange >= 0 ? cilArrowTop : cilArrowBottom} />)
              </span>
            )}
          </>
        }
        title="Nombre de Factures"
        action={
          <CDropdown className="mb-3">
            <CDropdownToggle color="transparent" caret={false} className="p-0">
              <CIcon icon={cilOptions} className="text-white" />
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem onClick={() => setSelectedTimeRange('ThisYear')}>
                Cette Année
              </CDropdownItem>
              <CDropdownItem onClick={() => setSelectedTimeRange('Last6Months')}>
                Les 6 Derniers Mois
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
                  label: 'Nombre de Factures',
                  backgroundColor: 'rgba(255,255,255,.2)',
                  borderColor: 'rgba(255,255,255,.55)',
                  data: monthlyInvoiceCounts,
                  fill: true,
                },
              ],
            }}
            options={{
              plugins: {
                legend: { display: false },
              },
              maintainAspectRatio: false,
              scales: {
                x: {
                  border: { display: false },
                  grid: { display: false, drawBorder: false },
                  ticks: { display: false },
                },
                y: {
                  display: false,
                  grid: { display: false },
                  ticks: { display: false },
                },
              },
              elements: {
                line: {
                  borderWidth: 1,
                  tension: 0.4,
                },
                point: {
                  radius: 0,
                  hitRadius: 10,
                  hoverRadius: 4,
                },
              },
            }}
          />
        }
      />
    </CCol>
  )
}

FactureWidget.propTypes = {
  getFacture: PropTypes.func.isRequired,
}

export default FactureWidget
