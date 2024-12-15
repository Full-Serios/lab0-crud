import { NextResponse } from 'next/server'
import { dbConnection } from '@/libs/mysql'

export async function GET () {
  try {
    const result = await dbConnection.query('SELECT * FROM DEPARTAMENTO')
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error al obtener municipios:', error)
    return NextResponse.json({
      message: 'Error al obtener municipios',
      error: error.message
    }, { status: 500 })
  }
}
