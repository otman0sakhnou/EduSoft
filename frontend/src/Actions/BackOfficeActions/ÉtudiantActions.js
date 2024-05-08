export async function getStudents() {
  try {
    const response = await fetch('http://localhost:5000/api/étudiant/')
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

export async function createStudent(student) {
  try {
    const response = await fetch('http://localhost:5000/api/étudiant', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(student),
    })

    if (!response.ok) {
      throw new Error("Échec de création d'étudiant")
    }

    const createdMatiere = await response.json()
    return createdMatiere
  } catch (error) {
    console.error("Erreur lors de la création d'étudiant:", error)
    throw error
  }
}
export async function updateStudent(id, updatedStudent) {
  try {
    const response = await fetch(`http://localhost:5000/api/étudiant/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedStudent),
    })

    if (!response.ok) {
      throw new Error("Échec de mise à jour de l'étudiant")
    }

    const updatedStudentData = await response.json()
    return updatedStudentData
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'étudiant:", error)
    throw error
  }
}

export async function deleteStudent(id) {
  try {
    const response = await fetch(`http://localhost:5000/api/étudiant/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error("Échec de suppression d'étudiant")
    }

    return true
  } catch (error) {
    console.error("Erreur lors de la suppression d'étudiant:", error)
    throw error
  }
}
