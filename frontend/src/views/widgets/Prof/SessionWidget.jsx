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

const SessionHistoryWidget = ({ fetchSessionHistory }) => {
  const auth = useAuth()
  const username = auth?.user?.profile?.name

  const [timeRange, setTimeRange] = useState('ThisYear')
  const [sessions, setSessions] = useState([])
  const [totalSessions, setTotalSessions] = useState(0)
  const [sessionsCountByMonth, setSessionsCountByMonth] = useState(Array(12).fill(0))

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const data = await fetchSessionHistory()
        const filteredData = data.filter((session) => session.nomProfesseur === username)
        setSessions(filteredData)
      } catch (error) {
        console.error('Error fetching session history:', error)
      }
    }

    fetchSessions()
  }, [fetchSessionHistory, username])

  useEffect(() => {
    const currentYear = new Date().getFullYear()
    const currentMonthIndex = new Date().getMonth()
    let filteredSessions = []

    switch (timeRange) {
      case 'ThisYear':
        filteredSessions = sessions.filter(
          (session) => new Date(session.dateSéance).getFullYear() === currentYear,
        )
        break
      case 'ThisMonth':
        filteredSessions = sessions.filter(
          (session) =>
            new Date(session.dateSéance).getFullYear() === currentYear &&
            new Date(session.dateSéance).getMonth() === currentMonthIndex,
        )
        break
      case 'Last6Months':
        const sixMonthsAgo = new Date()
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
        filteredSessions = sessions.filter(
          (session) => new Date(session.dateSéance) >= sixMonthsAgo,
        )
        break
      default:
        filteredSessions = sessions
    }

    setTotalSessions(filteredSessions.length)

    const monthlyCounts = Array(12).fill(0)
    filteredSessions.forEach((session) => {
      const sessionMonth = new Date(session.dateSéance).getMonth()
      monthlyCounts[sessionMonth]++
    })

    setSessionsCountByMonth(monthlyCounts)
  }, [sessions, timeRange])

  return (
    <CCol>
      <CWidgetStatsA
        className="mb-4"
        style={{ backgroundColor: '#C73659', color: 'white', height: '200px' }}
        value={totalSessions}
        title="Nombre de séances"
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
                  label: 'Nombre de séances',
                  backgroundColor: 'rgba(255,255,255,.2)',
                  borderColor: 'rgba(255,255,255,.55)',
                  data: sessionsCountByMonth,
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

SessionHistoryWidget.propTypes = {
  fetchSessionHistory: PropTypes.func.isRequired,
}

export default SessionHistoryWidget
