const API_URL = 'http://localhost:5000'

export async function getAllAbsences() {
  try {
    const response = await fetch(`${API_URL}/api/absence`)
    if (!response.ok) {
      throw new Error('Failed to fetch absences')
    }
    return await response.json()
  } catch (error) {
    throw error
  }
}
export async function reportAbsence(absenceDto, accessToken) {
  try {
    const response = await fetch(`${API_URL}/api/absence`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(absenceDto),
    })
    if (!response.ok) {
      throw new Error('Failed to report absence')
    }
    return await response.json()
  } catch (error) {
    throw error
  }
}
