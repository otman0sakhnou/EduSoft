import React from 'react'
import { CContainer, CRow, CCol, CCard, CCardHeader, CCardBody } from '@coreui/react'
import FactureWidget from '../widgets/Comptable/FactureWidget'
import { getAllFactures } from '../../Actions/BackOfficeActions/FactureActions'
import { getAllSessions } from '../../Actions/BackOfficeActions/SéanceActions'
import SalaryWidget from '../widgets/Admin/SalaryWidget'
import TotalSalary from '../widgets/Comptable/TotalSalary'
import ActiveProfWidget from '../widgets/Comptable/ActiveProfWidget'
import ProfSalaryWidget from '../widgets/Comptable/ProfSalaryWidget'
import FactureChart from '../charts/FactureChart'
import Facture from '../../BackOffice/facture/Facture'

function ComptableDash() {
  return (
    <CContainer fluid>
      <CRow className="my-4">
        <CCol>
          <h2>Bienvenue dans votre tableau de bord</h2>
        </CCol>
      </CRow>
      <CRow xs={{ gutter: 4 }}>
        <FactureWidget getFacture={getAllFactures} />
        <SalaryWidget getFacture={getAllFactures} />
        <TotalSalary getFacture={getAllFactures} />
      </CRow>
      <CRow xs={{ gutter: 4 }}>
        <ActiveProfWidget getSeance={getAllSessions} />
        <ProfSalaryWidget getFacture={getAllFactures} />
      </CRow>
      <CCard className="mb-4"></CCard>
      <CRow>
        <CCol>
          <CCard className="mb-4">
            <CCardHeader>Facture</CCardHeader>
            <CCardBody>
              <CRow className="mb-4 p-4 d-flex flex-column align-items-center ">
                <CCol>
                  <FactureChart getFacture={getAllFactures} />
                </CCol>
              </CRow>
              <hr className="mt-0" />
              <Facture />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default ComptableDash
