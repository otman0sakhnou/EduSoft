const BASE_URL = 'http://localhost:5000'

export async function getAllFactures() {
  try {
    const response = await fetch(`${BASE_URL}/api/facture`)
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error)
    throw error
  }
}
export async function addFacture(facture, accessToken) {
  try {
    const response = await fetch(`${BASE_URL}/api/facture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(facture),
    })

    if (!response.ok) {
      throw new Error('Failed to create facture')
    }

    const createdFacture = await response.json()
    return createdFacture
  } catch (error) {
    console.error('Error creating facture:', error)
    throw error
  }
}

export async function deleteFacture(factureId, accessToken) {
  try {
    const response = await fetch(`${BASE_URL}/api/facture/${factureId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to delete Facture')
    }

    return true
  } catch (error) {
    console.error('Error deleting facture:', error)
    throw error
  }
}
