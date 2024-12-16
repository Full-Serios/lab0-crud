import { NextResponse } from 'next/server'
import { dbConnection } from '@/libs/mysql'

export async function POST (request) {
  try {
    const body = await request.json()
    const {
      nombre,
      tipo,
      MUNICIPIO_id
    } = body

    // Verifica si ya existe un municipio con ese nombre
    const existingMunicipio = await dbConnection.query(
      'SELECT * FROM BARRIO WHERE nombre = ?',
      [nombre]
    )

    // Si ya existe devuelve error
    if (existingMunicipio.length > 0) {
      return NextResponse.json({
        message: 'Ya existe un barrio con este nombre'
      }, { status: 400 })
    }

    // Si no existe hace la inserción
    const result = await dbConnection.query(
            `INSERT INTO BARRIO
            (nombre, tipo, MUNICIPIO_id)
            VALUES (?, ?, ?)`,
            [
              nombre,
              tipo,
              MUNICIPIO_id
            ]
    )

    return NextResponse.json({
      message: 'Barrio insertado correctamente',
      insertId: result.insertId
    }, { status: 201 })
  } catch (error) {
    console.error('Error al insertar barrio:', error)
    return NextResponse.json({
      message: 'Error al insertar barrio',
      error: error.message
    }, { status: 500 })
  }
}

export async function GET () {
  try {
    const result = await dbConnection.query(`
        SELECT
            BARRIO.id,
            BARRIO.nombre,
            BARRIO.tipo,
            MUNICIPIO.nombre AS municipio
        FROM BARRIO
        JOIN MUNICIPIO ON BARRIO.MUNICIPIO_id = MUNICIPIO.id
      `)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error al obtener municipios:', error)
    return NextResponse.json({
      message: 'Error al obtener municipios',
      error: error.message
    }, { status: 500 })
  }
}
