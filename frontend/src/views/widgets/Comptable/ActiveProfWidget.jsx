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
import { getStyle } from '@coreui/utils'

const ActiveProfessorWidget = ({ getSeance }) => {
  const [timeRange, setTimeRange] = useState('ThisYear')
  const [totalSessions, setTotalSessions] = useState(0)
  const [filteredSeances, setFilteredSeances] = useState([])
  const [professorsCountByMonth, setProfessorsCountByMonth] = useState(Array(12).fill(0))

  useEffect(() => {
    const fetchSeances = async () => {
      try {
        const seances = await getSeance()
        setFilteredSeances(seances)
      } catch (error) {
        console.error('Error fetching seances:', error)
      }
    }

    fetchSeances()
  }, [getSeance])

  useEffect(() => {
    const currentYear = new Date().getFullYear()
    const currentMonthIndex = new Date().getMonth()
    let total = 0
    let distinctProfessors = new Set()

    filteredSeances.forEach((seance) => {
      const seanceYear = new Date(seance.dateSéance).getFullYear()
      const seanceMonthIndex = new Date(seance.dateSéance).getMonth()

      if (
        (timeRange === 'ThisYear' && seanceYear === currentYear) ||
        (timeRange === 'ThisMonth' &&
          seanceYear === currentYear &&
          seanceMonthIndex === currentMonthIndex)
      ) {
        total++
        distinctProfessors.add(seance.nomProfesseur)
      }
    })

    setTotalSessions(distinctProfessors.size)
  }, [filteredSeances, timeRange])

  useEffect(() => {
    const currentYear = new Date().getFullYear()
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

    filteredSeances.forEach((seance) => {
      const seanceYear = new Date(seance.dateSéance).getFullYear()
      const seanceMonth = months[new Date(seance.dateSéance).getMonth()].toLowerCase()
      const monthIndex = months.indexOf(seanceMonth)

      if (seanceYear === currentYear) {
        monthlyCounts[monthIndex]++
      }
    })

    setProfessorsCountByMonth(monthlyCounts)
  }, [filteredSeances])

  return (
    <CCol md={6} xl={6} xxl={6}>
      <CWidgetStatsA
        className="mb-4"
        style={{ backgroundColor: '#FF8F00', color: 'white', height: '200px' }}
        value={totalSessions}
        title="Professeurs actifs"
        action={
          <CDropdown className="mb-3">
            <CDropdownToggle color="transparent" caret={false} className="p-0">
              <CIcon icon={cilOptions} className="text-white" />
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem onClick={() => setTimeRange('ThisYear')}>Cette Année</CDropdownItem>
              <CDropdownItem onClick={() => setTimeRange('ThisMonth')}>Ce mois</CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
        }
        chart={
          <CChartLine
            className="my-2 mx-3"
            style={{ height: '100px' }}
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
                  label: 'Nombre de séances',
                  backgroundColor: 'rgba(255,255,255,.2)',
                  borderColor: 'rgba(255,255,255,.55)',
                  data: professorsCountByMonth,
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

ActiveProfessorWidget.propTypes = {
  getSeance: PropTypes.func.isRequired,
}

export default ActiveProfessorWidget
