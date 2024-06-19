import React, { useState, useEffect } from 'react'
import { CWidgetStatsA, CCol } from '@coreui/react'
import { CChartBar } from '@coreui/react-chartjs'
import PropTypes from 'prop-types'

const FilièreWidget = ({ getFilieres }) => {
  const [filieres, setFilieres] = useState([])
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        backgroundColor: 'rgba(255,255,255,.2)',
        borderColor: 'rgba(255,255,255,.55)',
        borderWidth: 1,
        barPercentage: 0.6,
      },
    ],
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const filieresData = await getFilieres()
        setFilieres(filieresData)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [getFilieres])

  useEffect(() => {
    const labels = filieres.map((filiere) => filiere.nomFilière)
    const data = filieres.map(() => 1)
    setChartData({
      labels,
      datasets: [
        {
          ...chartData.datasets[0],
          data,
        },
      ],
    })
  }, [filieres])

  return (
    <CCol lsm={6} xl={6} xxl={6}>
      <CWidgetStatsA
        className="mb-4"
        color="info"
        value={filieres.length}
        title="Total des Filières"
        chart={
          <CChartBar
            className="mt-3 mx-3"
            style={{ height: '93px' }}
            data={chartData}
            options={{
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                x: {
                  grid: {
                    display: false,
                    drawTicks: false,
                  },
                  ticks: {
                    display: false,
                  },
                },
                y: {
                  border: {
                    display: false,
                  },
                  grid: {
                    display: false,
                    drawBorder: false,
                    drawTicks: false,
                  },
                  ticks: {
                    display: false,
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

export default FilièreWidget

FilièreWidget.propTypes = {
  getFilieres: PropTypes.func.isRequired,
}
