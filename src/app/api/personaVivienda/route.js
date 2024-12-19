import { NextResponse } from 'next/server'
import { dbConnection } from '@/libs/mysql'

export async function POST (request) {
  try {
    const body = await request.json()
    const {
      PERSONA_id,
      VIVIENDA_id,
      fecha_adquisicion
    } = body

    // Verifica si ya existe una persona con esa vivienda
    const existingOwner = await dbConnection.query(
      'SELECT * FROM PERSONA_has_VIVIENDA WHERE PERSONA_id = ? AND VIVIENDA_id = ?',
      [
        PERSONA_id,
        VIVIENDA_id
      ]
    )

    // Si ya existe devuelve error
    if (existingOwner.length > 0) {
      return NextResponse.json({
        message: 'Esta persona ya tiene esta vivienda'
      }, { status: 400 })
    }

    // Verifica si la vivienda ya tiene propietario
    const existingOwnerProperty = await dbConnection.query(
      'SELECT * FROM PERSONA_has_VIVIENDA WHERE VIVIENDA_id = ?',
      [
        VIVIENDA_id
      ]
    )

    // Si ya existe devuelve error
    if (existingOwnerProperty.length > 0) {
      return NextResponse.json({
        message: 'Esta vivienda ya tiene propietario'
      }, { status: 400 })
    }

    // Si no existe hace la inserción
    const result = await dbConnection.query(
      `INSERT INTO PERSONA_has_VIVIENDA
      (PERSONA_id, VIVIENDA_id, fecha_adquisicion)
      VALUES (?, ?, ?)`,
      [
        PERSONA_id,
        VIVIENDA_id,
        fecha_adquisicion
      ]
    )
    return NextResponse.json({
      message: 'Propietario insertado correctamente',
      insertId: result.insertId
    }, { status: 201 })
  } catch (error) {
    console.error('Error al insertar propietario:', error)
    return NextResponse.json({
      message: 'Error al insertar propietario',
      error: error.message
    }, { status: 500 })
  }
}

export async function GET () {
  try {
    const result = await dbConnection.query(`
            SELECT
                PHV.PERSONA_id,
                PHV.VIVIENDA_id,
                PHV.fecha_adquisicion,
                P.nombre AS nombre_persona,
                P.apellido AS apellido_persona,
                V.direccion AS direccion_vivienda
            FROM
                VIVIENDA V
            JOIN
                PERSONA_has_VIVIENDA PHV ON V.id = PHV.VIVIENDA_id
            JOIN
                PERSONA P ON PHV.PERSONA_id = P.id
        `)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error al obtener viviendas:', error)
    return NextResponse.json({
      message: 'Error al obtener viviendas',
      error: error.message
    }, { status: 500 })
  }
}
