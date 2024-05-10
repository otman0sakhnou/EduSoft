/* eslint-disable react/no-unescaped-entities */
import React from 'react'
import {
  CCard,
  CCardBody,
  CCardTitle,
  CCardSubtitle,
  CCardText,
  CCardLink,
  CTable,
  CTableHead,
  CTableBody,
  CRow,
  CCol,
  CCardHeader,
} from '@coreui/react'

export default function Component() {
  return (
    <div className="container mx-auto my-8 px-4 sm:px-6 lg:px-8">
      <CCard style={{ maxWidth: '100%' }}>
        <CCardBody>
          <CCardHeader className="mb-3">
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 my-3">
              Signaler l'absence
            </h2>
          </CCardHeader>
          <form className="space-y-6">
            <CRow>
              <CCol>
                <div className="mb-4">
                  <label htmlFor="group" className="form-label">
                    Groupe enseigné
                  </label>
                  <select className="form-select" id="group">
                    <option defaultValue>Select group</option>
                    <option value="group1">Group 1</option>
                    <option value="group2">Group 2</option>
                    <option value="group3">Group 3</option>
                  </select>
                </div>
              </CCol>
              <CCol>
                <div className="mb-4">
                  <label htmlFor="module" className="form-label">
                    Module enseigné
                  </label>
                  <select className="form-select" id="module">
                    <option defaultValue>Select module</option>
                    <option value="module1">Module 1</option>
                    <option value="module2">Module 2</option>
                    <option value="module3">Module 3</option>
                  </select>
                </div>
              </CCol>
            </CRow>
            <CRow className="g-3">
              <CCol md={6}>
                <div className="mb-4">
                  <label htmlFor="date" className="form-label">
                    Date de séance
                  </label>
                  <input type="date" className="form-control" id="date" />
                </div>
              </CCol>
              <CCol>
                <div className="mb-4">
                  <label htmlFor="time" className="form-label">
                    Début de séance
                  </label>
                  <input type="time" className="form-control" id="time" />
                </div>
              </CCol>
              <CCol>
                <div className="mb-4">
                  <label htmlFor="time" className="form-label">
                    Fin de séance
                  </label>
                  <input type="time" className="form-control" id="time" />
                </div>
              </CCol>
            </CRow>
            <CRow>
              <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 my-3">
                La List des Étudiants
              </h2>
            </CRow>
            <div className="mb-4">
              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead color="dark">
                  <tr>
                    <th>Nom complet</th>
                    <th>Email</th>
                    <th>Absent(e)</th>
                  </tr>
                </CTableHead>
                <CTableBody>
                  <tr>
                    <td>John Doe</td>
                    <td>john.doe@example.com</td>
                    <td>
                      <input type="checkbox" id="absent-1" />
                    </td>
                  </tr>
                  <tr>
                    <td>Jane Smith</td>
                    <td>jane.smith@example.com</td>
                    <td>
                      <input type="checkbox" id="absent-2" />
                    </td>
                  </tr>
                  <tr>
                    <td>Bob Johnson</td>
                    <td>bob.johnson@example.com</td>
                    <td>
                      <input type="checkbox" id="absent-3" />
                    </td>
                  </tr>
                  <tr>
                    <td>Alice Williams</td>
                    <td>alice.williams@example.com</td>
                    <td>
                      <input type="checkbox" id="absent-4" />
                    </td>
                  </tr>
                </CTableBody>
              </CTable>
            </div>
            <CRow>
              <CCol className="text-end">
                <button
                  type="submit"
                  className="btn"
                  style={{
                    marginTop: '10px',
                    padding: '10px 20px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    borderRadius: '10px',
                    border: '2px solid #007bff',
                    color: '#ffffff',
                    backgroundColor: '#007bff',
                    cursor: 'pointer',
                  }}
                >
                  Signaler
                </button>
              </CCol>
            </CRow>
          </form>
        </CCardBody>
      </CCard>
    </div>
  )
}
