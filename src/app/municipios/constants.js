import axios from 'axios'

async function loadDepartamentos () {
  try {
    const res = await axios.get('http://localhost:3000/api/departamento')
    console.log(res.data)
    return res.data
  } catch (error) {
    console.error('Error al obtener departamentos:', error)
  }
}

