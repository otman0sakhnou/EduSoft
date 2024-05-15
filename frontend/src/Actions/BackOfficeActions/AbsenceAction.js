const API_URL = 'http://localhost:5000'

export const AbsenceService = {
  getAllAbsences: async () => {
    try {
      const response = await fetch(`${API_URL}/api/absence/AllAbsences`)
      if (!response.ok) {
        throw new Error('Failed to fetch absences')
      }
      return await response.json()
    } catch (error) {
      throw error
    }
  },

  reportAbsence: async (absenceDto, accessToken) => {
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
  },
}
