const API_URL = 'http://localhost:5000'

export async function getAllSessions() {
  try {
    const response = await fetch(`${API_URL}/api/séance`)
    if (!response.ok) {
      throw new Error('Failed to fetch sessions')
    }
    return await response.json()
  } catch (error) {
    throw error
  }
}
export async function addSession(sessionDto, accessToken) {
  try {
    const response = await fetch(`${API_URL}/api/séance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(sessionDto),
    })
    if (!response.ok) {
      throw new Error('Failed to add session')
    }
    return await response.json()
  } catch (error) {
    throw error
  }
}

export async function getHoursWorked(name, date) {
  try {
    const response = await fetch(
      `${API_URL}/api/séance/TotalHoursByProfessor?nomProfesseur=${name}&date=${date}`,
    )
    if (!response.ok) {
      throw new Error('Failed to fetch data')
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching data:', error)
    throw error
  }
}

export async function getTopModulesWithMostAbsences(groupId) {
  try {
    const response = await fetch(`${API_URL}/api/séance/top-modules?groupId=${groupId}`)
    if (!response.ok) {
      throw new Error('Failed to fetch top modules with most absences')
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching top modules with most absences:', error)
    throw error
  }
}

export async function getMonthlyAbsencesCount(groupId) {
  try {
    const response = await fetch(`${API_URL}/api/séance/monthly-absences?groupId=${groupId}`)
    if (!response.ok) {
      throw new Error('Failed to fetch monthly absences count')
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching monthly absences count:', error)
    throw error
  }
}
export async function getAbsenceCounts(studentId) {
  try {
    const response = await fetch(`${API_URL}/api/séance/absenceCounts/${studentId}`)
    if (!response.ok) {
      throw new Error('Failed to fetch absence counts')
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching absence counts:', error)
    throw error
  }
}
export async function getLastAbsence(studentId) {
  try {
    const response = await fetch(`${API_URL}/api/séance/lastAbsence/${studentId}`)
    if (!response.ok) {
      throw new Error('Failed to fetch absence date')
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching absence date:', error)
    throw error
  }
}
export async function getSessionsByEtudiant(etudiantId) {
  try {
    const response = await fetch(`${API_URL}/api/séance/by-etudiant/${etudiantId}`)
    if (!response.ok) {
      throw new Error('Failed to fetch sessions by étudiant ID')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching sessions by étudiant ID:', error)
    throw error
  }
}
export async function getSeancesByProfessorAndDate(nomProfesseur, year, month) {
  try {
    const response = await fetch(
      `${API_URL}/api/séance/by-professor-and-date?nomProfesseur=${nomProfesseur}&year=${year}&month=${month}`,
    )
    if (!response.ok) {
      throw new Error('Failed to fetch seances for the specified professor and date')
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching seances:', error)
    throw error
  }
}
