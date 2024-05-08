export async function getModules() {
  try {
    const response = await fetch('http://localhost:5000/api/module/')
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

export async function createModule(matiere) {
  try {
    const response = await fetch('http://localhost:5000/api/module', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(matiere),
    })

    if (!response.ok) {
      throw new Error('Échec de création de module')
    }

    const createdMatiere = await response.json()
    return createdMatiere
  } catch (error) {
    console.error('Erreur lors de la création de module:', error)
    throw error
  }
}
export async function updateModule(id, module) {
  try {
    const response = await fetch(`http://localhost:5000/api/module/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(module),
    })

    if (!response.ok) {
      throw new Error(`Failed to update module: ${response.status} ${response.statusText}`)
    }

    const updatedModule = await response.json()
    return updatedModule
  } catch (error) {
    console.error('Error updating module:', error)
    throw error
  }
}
export async function deleteModule(id) {
  try {
    const response = await fetch(`http://localhost:5000/api/module/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error('Échec de suppression du module')
    }

    return true
  } catch (error) {
    console.error('Erreur lors de la suppression du module:', error)
    throw error
  }
}
