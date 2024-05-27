/* eslint-disable react/no-unescaped-entities */
import React, { useState, useEffect } from 'react'
import { getUsers } from '../Actions/UserActions/getUsers'
import Avatar from '@mui/material/Avatar'
import Stack from '@mui/material/Stack'
import { Typography, TextField } from '@mui/material'
import {
  CCardBody,
  CCard,
  CCardHeader,
  CPagination,
  CPaginationItem,
  CRow,
  CCol,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSearch } from '@coreui/icons'

function UserList() {
  const [users, setUsers] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getUsers()
        setUsers(data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [])

  function stringToColor(string) {
    let hash = 0
    let i
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash)
    }

    let color = '#'

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff
      color += `00${value.toString(16)}`.slice(-2)
    }

    return color
  }

  function handleSearch(event) {
    setSearchQuery(event.target.value)
    setCurrentPage(1)
  }

  const lastItemIndex = currentPage * itemsPerPage
  const firstItemIndex = lastItemIndex - itemsPerPage
  const totalPages = Math.ceil(users.length / itemsPerPage)
  const currentUsers = users
    .filter((user) => user.fullName.toLowerCase().includes(searchQuery.toLowerCase()))
    .slice(firstItemIndex, lastItemIndex)

  function changePage(pageNumber) {
    setCurrentPage(pageNumber)
  }

  return (
    <CCard className="shadow-lg">
      <CCardBody>
        <CCardHeader className="d-flex justify-content-between align-items-center mb-4">
          <Typography variant="h4" className="text-2xl font-bold">
            Gestion des utilisateurs
          </Typography>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <TextField
              id="search"
              label="Recherche par le nom complet"
              variant="outlined"
              size="small"
              onChange={handleSearch}
              style={{ maxWidth: '100%' }}
              InputProps={{
                endAdornment: <CIcon content={cilSearch} />,
              }}
            />
          </div>
        </CCardHeader>
        <CRow>
          {currentUsers.map((user, index) => (
            <CCol xs={12} sm={6} md={4} lg={3} key={index}>
              <CCard
                className="mb-4 shadow-lg"
                style={{
                  transition: 'transform 0.3s',
                  borderRadius: '20px',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <CCardBody>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: stringToColor(user.userName) }}>
                      {user.userName.charAt(0)}
                    </Avatar>
                    <div>
                      <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                        {user.fullName}
                      </Typography>
                      <Typography variant="body2">{user.email}</Typography>
                    </div>
                  </Stack>
                  <div style={{ marginTop: '10px' }}>
                    <Typography variant="body2">Nom d'utilisateur: {user.userName}</Typography>
                    <Typography variant="body2">Rôle: {user.roleName}</Typography>
                  </div>
                </CCardBody>
              </CCard>
            </CCol>
          ))}
        </CRow>
        <CPagination
          aria-label="Page navigation example"
          activePage={currentPage}
          pages={totalPages}
          onActivePageChange={changePage}
          className="d-flex justify-content-center mt-4"
        >
          <CPaginationItem
            aria-label="Previous"
            disabled={currentPage === 1}
            onClick={() => changePage(currentPage - 1)}
          >
            <span aria-hidden="true">&laquo;</span>
          </CPaginationItem>
          {[...Array(totalPages).keys()].map((page) => (
            <CPaginationItem
              key={page + 1}
              active={currentPage === page + 1}
              onClick={() => changePage(page + 1)}
            >
              {page + 1}
            </CPaginationItem>
          ))}
          <CPaginationItem
            aria-label="Next"
            disabled={currentPage === totalPages}
            onClick={() => changePage(currentPage + 1)}
          >
            <span aria-hidden="true">&raquo;</span>
          </CPaginationItem>
        </CPagination>
      </CCardBody>
    </CCard>
  )
}

export default UserList
