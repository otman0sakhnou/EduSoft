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
import { CChartBar } from '@coreui/react-chartjs'
import PropTypes from 'prop-types'

const GroupeWidget = ({ getGroupes, getFilieres }) => {
  const [groupes, setGroupes] = useState([])
  const [filieres, setFilieres] = useState(['Tous'])
  const [selectedFiliere, setSelectedFiliere] = useState('Tous')
  const [filteredGroupes, setFilteredGroupes] = useState([])
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Nombre de Groupes',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(75, 192, 192, 0.4)',
        hoverBorderColor: 'rgba(75, 192, 192, 1)',
        data: [],
      },
    ],
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const groupesData = await getGroupes()
        const filieresData = await getFilieres()
        setGroupes(groupesData)
        setFilieres(['Tous', ...filieresData.map((filiere) => filiere.nomFilière)])
        setFilteredGroupes(groupesData)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [getGroupes, getFilieres])

  useEffect(() => {
    const filiereCounts = filieres.reduce((counts, filiere) => {
      counts[filiere] = groupes.filter((groupe) => groupe.nomFilière === filiere).length
      return counts
    }, {})

    setChartData({
      labels: filieres,
      datasets: [
        {
          label: 'Nombre de Groupes',
          backgroundColor: 'rgba(255,255,255,.2)',
          borderColor: 'rgba(255,255,255,.55)',
          data: filieres.map((filiere) => filiereCounts[filiere] || 0),
          barPercentage: 0.6,
        },
      ],
    })
  }, [groupes, filieres])

  useEffect(() => {
    if (selectedFiliere === 'Tous') {
      setFilteredGroupes(groupes)
    } else {
      const filtered = groupes.filter((groupe) => groupe.nomFilière === selectedFiliere)
      setFilteredGroupes(filtered)
    }
  }, [selectedFiliere, groupes])

  const handleSelectFiliere = (filiere) => {
    setSelectedFiliere(filiere)
  }

  return (
    <CCol lsm={6} xl={6} xxl={6}>
      <CWidgetStatsA
        className="mb-4"
        color="primary"
        title="Total des Groupes"
        value={filteredGroupes.length}
        action={
          <CDropdown alignment="end">
            <CDropdownToggle color="transparent" caret={false} className="p-0">
              <CIcon icon={cilOptions} className="text-white" />
            </CDropdownToggle>
            <CDropdownMenu>
              {filieres.map((filiere, index) => (
                <CDropdownItem key={index} onClick={() => handleSelectFiliere(filiere)}>
                  {filiere}
                </CDropdownItem>
              ))}
            </CDropdownMenu>
          </CDropdown>
        }
        chart={
          <CChartBar
            data={chartData}
            className="mt-3 mx-3"
            style={{ height: '75px' }}
            options={{
              plugins: {
                legend: {
                  display: false,
                },
              },
              maintainAspectRatio: false,
              scales: {
                x: {
                  display: false,
                },
                y: {
                  display: false,
                },
              },
              elements: {
                line: {
                  borderWidth: 2,
                  tension: 0.4,
                },
                point: {
                  radius: 4,
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

export default GroupeWidget

GroupeWidget.propTypes = {
  getGroupes: PropTypes.func.isRequired,
  getFilieres: PropTypes.func.isRequired,
}
