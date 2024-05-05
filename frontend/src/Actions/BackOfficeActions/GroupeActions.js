export async function getGroupes() {
  try {
    const response = await fetch('http://localhost:5000/api/groupe/')
    if (!response.ok) {
      throw new Error('Échec de récupération des données')
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Erreur lors de la récupération des données:', error)
    throw error
  }
}

export async function createGroupe(groupe) {
  try {
    const response = await fetch('http://localhost:5000/api/groupe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(groupe),
    })

    if (!response.ok) {
      throw new Error('Échec de création de module')
    }

    const createdMatiere = await response.json()
    return createdMatiere
  } catch (error) {
    console.error('Erreur lors de la création de groupe:', error)
    throw error
  }
}
export async function updateGroupe(id, groupe) {
  try {
    const response = await fetch(`http://localhost:5000/api/groupe/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(groupe),
    })

    if (!response.ok) {
      throw new Error('Failed to update group')
    }

    const updatedGroupe = await response.json()
    return updatedGroupe
  } catch (error) {
    console.error('Error updating group:', error)
    throw error
  }
}

export async function getByGroupeName(name) {
  try {
    const response = await fetch(`http://localhost:5000/api/groupe/byGroupName/${name}`)
    if (!response.ok) {
      throw new Error('Échec de récupération des données')
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Erreur lors de la récupération des données:', error)
    throw error
  }
}

export async function deleteGroupe(id) {
  try {
    const response = await fetch(`http://localhost:5000/api/groupe/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error('Échec de suppression du groupe')
    }

    return true
  } catch (error) {
    console.error('Erreur lors de la suppression du groupe:', error)
    throw error
  }
}
