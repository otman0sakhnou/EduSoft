import React from 'react'
import { CContainer, CRow, CCol, CCard, CCardHeader, CCardBody } from '@coreui/react'
import SessionWidget from '../widgets/Prof/SessionWidget'
import InvoicesWidget from '../widgets/Prof/ProfFactureWidget'
import ProfSeanceTable from '../Tables/ProfSeanceTable'
import ProfessorDetailsWidget from '../widgets/Prof/ProfessorDetailsWidget'
import ProfFactureTable from '../Tables/ProfFactureTable'
import { getAllSessions } from '../../Actions/BackOfficeActions/SéanceActions'
import { getAllFactures } from '../../Actions/BackOfficeActions/FactureActions'
import { getGroupeById } from '../../Actions/BackOfficeActions/GroupeActions'
import { getModuleById } from '../../Actions/BackOfficeActions/ModuleActions'
import { getStudents } from '../../Actions/BackOfficeActions/ÉtudiantActions'

const ProfDashboard = () => {
  return (
    <CContainer>
      <CRow className="my-4">
        <CCol>
          <h2>Bienvenue dans votre tableau de bord</h2>
        </CCol>
      </CRow>
      <CRow>
        <CCol md={6}>
          <SessionWidget fetchSessionHistory={getAllSessions} />
        </CCol>
        <CCol md={6}>
          <InvoicesWidget fetchInvoices={getAllFactures} />
        </CCol>
      </CRow>
      <CCard className="mb-4"></CCard>
      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>Séances {' & '} Factures</CCardHeader>
            <CCardBody>
              <CRow>
                <ProfessorDetailsWidget getseance={getAllSessions} getStudentData={getStudents} />
              </CRow>
              <CCard className="mb-4"></CCard>
              <CRow>
                <ProfSeanceTable
                  sessions={getAllSessions}
                  getModuleById={getModuleById}
                  getGroupeById={getGroupeById}
                />
              </CRow>
              <CCard className="mb-4"></CCard>
              <CRow>
                <ProfFactureTable invoices={getAllFactures} />
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default ProfDashboard
