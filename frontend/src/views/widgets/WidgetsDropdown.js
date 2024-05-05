import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { CRow, CCol, CWidgetStatsA } from '@coreui/react'

const TotalSalaryWidget = ({ totalSalary }) => (
  <CCol sm={6} xl={4} xxl={3}>
    <CWidgetStatsA color="primary" value={totalSalary} title="Moyenne des Salaires" />
  </CCol>
)

TotalSalaryWidget.propTypes = {
  totalSalary: PropTypes.number.isRequired,
}

const TotalGroupsWidget = ({ totalGroups }) => (
  <CCol sm={6} xl={4} xxl={3}>
    <CWidgetStatsA color="info" value={totalGroups} title="Total Groups" />
  </CCol>
)

TotalGroupsWidget.propTypes = {
  totalGroups: PropTypes.number.isRequired,
}

const TotalStudentsWidget = ({ totalStudents }) => (
  <CCol sm={6} xl={4} xxl={3}>
    <CWidgetStatsA color="warning" value={totalStudents} title="Total Students" />
  </CCol>
)

TotalStudentsWidget.propTypes = {
  totalStudents: PropTypes.number.isRequired,
}

const TotalModulesWidget = ({ totalModules }) => (
  <CCol sm={6} xl={4} xxl={3}>
    <CWidgetStatsA color="success" value={totalModules} title="Total Modules" />
  </CCol>
)

TotalModulesWidget.propTypes = {
  totalModules: PropTypes.number.isRequired,
}

const TotalFilieresWidget = ({ totalFilieres }) => (
  <CCol sm={6} xl={4} xxl={3}>
    <CWidgetStatsA color="danger" value={totalFilieres} title="Total Filieres" />
  </CCol>
)

TotalFilieresWidget.propTypes = {
  totalFilieres: PropTypes.number.isRequired,
}

const WidgetsDropdown = ({ className }) => {
  // Example data, replace with actual data from API or state management
  const [totalSalary, setTotalSalary] = useState(26000)
  const [totalGroups, setTotalGroups] = useState(12)
  const [totalStudents, setTotalStudents] = useState(200)
  const [totalModules, setTotalModules] = useState(50)
  const [totalFilieres, setTotalFilieres] = useState(5)

  useEffect(() => {
    // Fetch data or perform calculations here
  }, [])

  return (
    <CRow className={className} xs={{ gutter: 4 }}>
      <TotalSalaryWidget totalSalary={totalSalary} />
      <TotalGroupsWidget totalGroups={totalGroups} />
      <TotalStudentsWidget totalStudents={totalStudents} />
      <TotalModulesWidget totalModules={totalModules} />
      <TotalFilieresWidget totalFilieres={totalFilieres} />
    </CRow>
  )
}

WidgetsDropdown.propTypes = {
  className: PropTypes.string,
}

export default WidgetsDropdown
