export async function getFilières() {
  try {
    const response = await fetch('http://localhost:5000/api/filière/')
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
export async function createFiliere(filiere) {
  try {
    const response = await fetch('http://localhost:5000/api/filière', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(filiere),
    })

    if (!response.ok) {
      throw new Error('Failed to create filière')
    }

    const createdFiliere = await response.json()
    return createdFiliere
  } catch (error) {
    console.error('Error creating filière:', error)
    throw error
  }
}
export async function updateFiliere(id, filiere) {
  try {
    const response = await fetch(`http://localhost:5000/api/filière/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(filiere),
    })

    if (!response.ok) {
      throw new Error('Failed to update filière')
    }

    const updateFiliere = await response.json()
    return updateFiliere
  } catch (error) {
    console.error('Error updating filière:', error)
    throw error
  }
}
export async function getFilièreByName(name) {
  try {
    const response = await fetch(`http://localhost:5000/api/filière/byFilièreName/${name}`)
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
export async function deleteFilière(id) {
  try {
    const response = await fetch(`http://localhost:5000/api/filière/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error('Failed to delete Filière')
    }

    return true
  } catch (error) {
    console.error('Error deleting Filière:', error)
    throw error
  }
}
