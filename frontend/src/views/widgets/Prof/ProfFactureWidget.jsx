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
import { CChartLine } from '@coreui/react-chartjs'
import { cilOptions } from '@coreui/icons'
import { useAuth } from 'react-oidc-context'

const InvoicesWidget = ({ fetchInvoices }) => {
  const auth = useAuth()
  const username = auth?.user?.profile?.name

  const [timeRange, setTimeRange] = useState('ThisYear')
  const [invoices, setInvoices] = useState([])
  const [totalAmount, setTotalAmount] = useState(0)
  const [amountByMonth, setAmountByMonth] = useState(Array(12).fill(0))

  const monthMapping = {
    janvier: 0,
    février: 1,
    mars: 2,
    avril: 3,
    mai: 4,
    juin: 5,
    juillet: 6,
    août: 7,
    septembre: 8,
    octobre: 9,
    novembre: 10,
    décembre: 11,
  }

  useEffect(() => {
    const fetchInvoiceData = async () => {
      try {
        const data = await fetchInvoices()
        const filteredData = data.filter((invoice) => invoice.nomProfesseur === username)
        setInvoices(filteredData)
      } catch (error) {
        console.error('Error fetching invoices:', error)
      }
    }

    fetchInvoiceData()
  }, [fetchInvoices, username])

  useEffect(() => {
    const currentYear = new Date().getFullYear()
    const currentMonthIndex = new Date().getMonth()
    let filteredInvoices = []

    switch (timeRange) {
      case 'ThisYear':
        filteredInvoices = invoices.filter((invoice) => parseInt(invoice.année, 10) === currentYear)
        break
      case 'ThisMonth':
        filteredInvoices = invoices.filter(
          (invoice) =>
            parseInt(invoice.année, 10) === currentYear &&
            monthMapping[invoice.mois] === currentMonthIndex,
        )
        break
      case 'Last6Months':
        const sixMonthsAgo = new Date()
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
        filteredInvoices = invoices.filter((invoice) => {
          const invoiceDate = new Date(currentYear, monthMapping[invoice.mois])
          return invoiceDate >= sixMonthsAgo
        })
        break
      default:
        filteredInvoices = invoices
    }

    const total = filteredInvoices.reduce((sum, invoice) => sum + invoice.montantTotale, 0)
    setTotalAmount(total)

    const monthlyCounts = Array(12).fill(0)
    filteredInvoices.forEach((invoice) => {
      const invoiceMonth = monthMapping[invoice.mois]
      monthlyCounts[invoiceMonth] += invoice.montantTotale
    })
    setAmountByMonth(monthlyCounts)
  }, [invoices, timeRange])

  return (
    <CCol>
      <CWidgetStatsA
        className="mb-4"
        style={{ backgroundColor: '#6420AA', color: 'white', height: '200px' }}
        value={`DH ${totalAmount.toFixed(2)}`}
        title="Montant total des factures"
        action={
          <CDropdown className="mb-3">
            <CDropdownToggle color="transparent" caret={false} className="p-0">
              <CIcon icon={cilOptions} className="text-white" />
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem onClick={() => setTimeRange('ThisYear')}>Cette Année</CDropdownItem>
              <CDropdownItem onClick={() => setTimeRange('ThisMonth')}>Ce mois</CDropdownItem>
              <CDropdownItem onClick={() => setTimeRange('Last6Months')}>
                6 Derniers Mois
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
                  label: 'Montant des factures',
                  backgroundColor: 'rgba(255,255,255,.2)',
                  borderColor: 'rgba(255,255,255,.55)',
                  data: amountByMonth,
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

InvoicesWidget.propTypes = {
  fetchInvoices: PropTypes.func.isRequired,
}

export default InvoicesWidget
