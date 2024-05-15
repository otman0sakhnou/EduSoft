const API_URL = 'http://localhost:5000'

export const SessionService = {
  getAllSessions: async () => {
    try {
      const response = await fetch(`${API_URL}/api/séance`)
      if (!response.ok) {
        throw new Error('Failed to fetch sessions')
      }
      return await response.json()
    } catch (error) {
      throw error
    }
  },

  addSession: async (sessionDto, accessToken) => {
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
  },
}
