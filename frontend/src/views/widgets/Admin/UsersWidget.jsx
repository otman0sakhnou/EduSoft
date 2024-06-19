import React, { useState, useEffect } from 'react'
import { CCol, CWidgetStatsD } from '@coreui/react'
import { CChartLine } from '@coreui/react-chartjs'
import CIcon from '@coreui/icons-react'
import { cilGroup } from '@coreui/icons'
import PropTypes from 'prop-types'

const UsersWidget = ({ getUsers, getStudents }) => {
  const [usersCount, setUsersCount] = useState(0)
  const [studentsCount, setStudentsCount] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersData = await getUsers()
        const studentsData = await getStudents()
        setUsersCount(usersData.length)
        setStudentsCount(studentsData.length)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [getUsers, getStudents])

  return (
    <CCol lsm={6} xl={6} xxl={6}>
      <CWidgetStatsD
        className="mb-5"
        icon={<CIcon className="my-3 text-white" icon={cilGroup} height={52} />}
        chart={
          <CChartLine
            style={{ height: '75px' }}
            className="position-absolute w-100 h-100"
            data={{
              datasets: [
                {
                  backgroundColor: 'rgba(255,255,255,.1)',
                  borderColor: 'rgba(255,255,255,.55)',
                  pointHoverBackgroundColor: '#fff',
                  borderWidth: 2,
                  fill: true,
                },
              ],
            }}
            options={{
              elements: {
                line: {
                  tension: 0.4,
                },
                point: {
                  radius: 0,
                  hitRadius: 10,
                  hoverRadius: 4,
                  hoverBorderWidth: 3,
                },
              },
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                x: {
                  display: false,
                },
                y: {
                  display: false,
                },
              },
            }}
          />
        }
        style={{
          backgroundImage:
            'radial-gradient(circle at 77% 26%, rgba(175, 175, 175,0.06) 0%, rgba(175, 175, 175,0.06) 4%,transparent 4%, transparent 100%),radial-gradient(circle at 37% 90%, rgba(129, 129, 129,0.06) 0%, rgba(129, 129, 129,0.06) 55%,transparent 55%, transparent 100%),radial-gradient(circle at 7% 92%, rgba(53, 53, 53,0.06) 0%, rgba(53, 53, 53,0.06) 39%,transparent 39%, transparent 100%),radial-gradient(circle at 65% 17%, rgba(128, 128, 128,0.06) 0%, rgba(128, 128, 128,0.06) 60%,transparent 60%, transparent 100%),radial-gradient(circle at 100% 39%, rgba(75, 75, 75,0.06) 0%, rgba(75, 75, 75,0.06) 20%,transparent 20%, transparent 100%),radial-gradient(circle at 92% 34%, rgba(205, 205, 205,0.06) 0%, rgba(205, 205, 205,0.06) 35%,transparent 35%, transparent 100%),radial-gradient(circle at 63% 90%, rgba(98, 98, 98,0.06) 0%, rgba(98, 98, 98,0.06) 62%,transparent 62%, transparent 100%),radial-gradient(circle at 93% 74%, rgba(130, 130, 130,0.06) 0%, rgba(130, 130, 130,0.06) 65%,transparent 65%, transparent 100%),linear-gradient(90deg, rgb(18, 233, 78),rgb(160, 239, 92))',
          color: 'white',
        }}
        values={[
          { title: 'Utilisateur', value: usersCount },
          { title: 'Étudiants', value: studentsCount },
        ]}
      />
    </CCol>
  )
}

export default UsersWidget

UsersWidget.propTypes = {
  getUsers: PropTypes.func.isRequired,
  getStudents: PropTypes.func.isRequired,
}
