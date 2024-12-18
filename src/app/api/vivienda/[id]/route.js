import { NextResponse } from 'next/server'
import { dbConnection } from '@/libs/mysql'

export async function PUT (request, { params }) {
  try {
    const { id } = params

    const body = await request.json()
    const {
      capacidad,
      niveles,
      tipo,
      estrato
    } = body

    // Verifica si existe la vivienda que se quiere actualizar
    const existingVivienda = await dbConnection.query(
      'SELECT * FROM VIVIENDA WHERE id = ?',
      [id]
    )

    // Si no existe la vivienda devuelve error
    if (existingVivienda.length === 0) {
      return NextResponse.json({
        message: 'No existe una vivienda con este ID'
      }, { status: 404 })
    }

    // Realiza la actualización
    const result = await dbConnection.query(
            `UPDATE VIVIENDA
            SET capacidad = ?, niveles = ?, tipo = ?,
            estrato = ?
            WHERE id = ?`,
            [
              capacidad,
              niveles,
              tipo,
              estrato,
              id
            ]
    )

    return NextResponse.json({
      message: 'Vivienda actualizada correctamente',
      updatedRows: result.affectedRows
    }, { status: 200 })
  } catch (error) {
    console.error('Error al actualizar vivienda:', error)
    return NextResponse.json({
      message: 'Error al actualizar vivienda',
      error: error.message
    }, { status: 500 })
  }
}

export async function GET (request, { params }) {
  try {    
    const { id } = params

    const result = await dbConnection.query(`
            SELECT
                V.id,
                V.direccion,
                V.capacidad,
                V.niveles,
                V.tipo,
                V.estrato,
                B.nombre AS barrio_nombre,
                M.nombre AS municipio_nombre,
                V.BARRIO_id,
                V.MUNICIPIO_id
            FROM
                VIVIENDA V
            JOIN
                BARRIO B ON V.BARRIO_id = B.id
            JOIN
                MUNICIPIO M ON V.MUNICIPIO_id = M.id
            WHERE
                V.MUNICIPIO_id = ?
        `,
        [
          id
        ])
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error al obtener viviendas:', error)
    return NextResponse.json({
      message: 'Error al obtener viviendas',
      error: error.message
    }, { status: 500 })
  }
}