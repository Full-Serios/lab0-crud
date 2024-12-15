import { NextResponse } from 'next/server'
import { dbConnection } from '@/libs/mysql'

export async function POST (request) {
  try {
    const body = await request.json()
    const {
      nombre,
      area_km2,
      presupuesto,
      poblacion,
      DEPARTAMENTO_id
    } = body

    // Verifica si ya existe un municipio con ese nombre
    const existingMunicipio = await dbConnection.query(
      'SELECT * FROM MUNICIPIO WHERE nombre = ?',
      [nombre]
    )

    // Si ya existe devuelve error
    if (existingMunicipio.length > 0) {
      return NextResponse.json({
        message: 'Ya existe un municipio con este nombre'
      }, { status: 400 })
    }

    // Si no existe hace la inserción
    const result = await dbConnection.query(
            `INSERT INTO MUNICIPIO
            (nombre, area_km2, presupuesto, poblacion, DEPARTAMENTO_id)
            VALUES (?, ?, ?, ?, ?)`,
            [
              nombre,
              area_km2,
              presupuesto,
              poblacion,
              DEPARTAMENTO_id
            ]
    )

    return NextResponse.json({
      message: 'Municipio insertado correctamente',
      insertId: result.insertId
    }, { status: 201 })
  } catch (error) {
    console.error('Error al insertar municipio:', error)
    return NextResponse.json({
      message: 'Error al insertar municipio',
      error: error.message
    }, { status: 500 })
  }
}

export async function GET () {
  try {
    const result = await dbConnection.query(`
            SELECT
                MUNICIPIO.id,
                MUNICIPIO.nombre,
                MUNICIPIO.area_km2,
                MUNICIPIO.presupuesto,
                MUNICIPIO.poblacion,
                DEPARTAMENTO.nombre AS departamento
            FROM MUNICIPIO
            JOIN DEPARTAMENTO ON MUNICIPIO.DEPARTAMENTO_id = DEPARTAMENTO.id
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
