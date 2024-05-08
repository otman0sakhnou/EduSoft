export async function getUsers() {
  try {
    const response = await fetch('http://localhost:5001/api/user')
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
