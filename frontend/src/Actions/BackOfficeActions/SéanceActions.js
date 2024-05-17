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
