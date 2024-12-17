import { NextResponse } from 'next/server'
import { dbConnection } from '@/libs/mysql'

export async function POST (request) {
  try {
    const body = await request.json()
    const {
      id,
      nombre,
      apellido,
      telefono,
      edad,
      sexo,
      MUNICIPIO_id,
      VIVIENDA_id,
      PERSONA_cabeza_familia_id
    } = body

    // Verifica si ya existe una persona con ese teléfono
    const existingPersona = await dbConnection.query(
      'SELECT * FROM PERSONA WHERE id = ?',
      [id]
    )

    // Si ya existe devuelve error
    if (existingPersona.length > 0) {
      return NextResponse.json({
        message: 'Ya existe una persona con este teléfono'
      }, { status: 400 })
    }

    // Verificar el estado de cabeza de familia
    let finalCabezaFamiliaId = PERSONA_cabeza_familia_id

    // Si PERSONA_cabeza_familia_id no está especificado, buscar cabeza de familia existente
    if (finalCabezaFamiliaId === undefined) {
      const existingCabezaFamilia = await dbConnection.query(
                `SELECT id FROM PERSONA
                 WHERE VIVIENDA_id = ? AND PERSONA_cabeza_familia_id IS NULL`,
                [VIVIENDA_id]
      )

      // Si no hay cabeza de familia, esta persona será la cabeza de familia
      if (existingCabezaFamilia.length === 0) {
        finalCabezaFamiliaId = null
      } else {
        // Si ya hay una cabeza de familia, usar su ID
        finalCabezaFamiliaId = existingCabezaFamilia[0].id
      }
    }
    // Si PERSONA_cabeza_familia_id está especificado como null
    else if (finalCabezaFamiliaId === null) {
      const existingCabezaFamilia = await dbConnection.query(
                `SELECT * FROM PERSONA
                 WHERE VIVIENDA_id = ? AND PERSONA_cabeza_familia_id IS NULL`,
                [VIVIENDA_id]
      )

      if (existingCabezaFamilia.length > 0) {
        return NextResponse.json({
          message: 'Ya existe una persona como cabeza de familia en esta vivienda'
        }, { status: 400 })
      }
    }

    // Iniciar una transacción
    await dbConnection.query('START TRANSACTION')
    try {
      // Insertar la persona
      const resultPersona = await dbConnection.query(
                `INSERT INTO PERSONA
                (id, nombre, apellido, telefono, edad, sexo, MUNICIPIO_id, VIVIENDA_id, PERSONA_cabeza_familia_id)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                  id,
                  nombre,
                  apellido,
                  telefono,
                  edad,
                  sexo,
                  MUNICIPIO_id,
                  VIVIENDA_id,
                  finalCabezaFamiliaId
                ]
      )

      // Aumentar la población del municipio
      await dbConnection.query(
                `UPDATE MUNICIPIO
                SET poblacion = poblacion + 1
                WHERE id = ?`,
                [MUNICIPIO_id]
      )

      // Confirmar la transacción
      await dbConnection.query('COMMIT')
      return NextResponse.json({
        message: 'Persona insertada correctamente y población actualizada',
        insertId: resultPersona.insertId
      }, { status: 201 })
    } catch (insertError) {
      // Revertir la transacción en caso de error
      await dbConnection.query('ROLLBACK')
      throw insertError
    }
  } catch (error) {
    console.error('Error al insertar persona:', error)
    return NextResponse.json({
      message: 'Error al insertar persona',
      error: error.message
    }, { status: 500 })
  }
}

export async function GET () {
  try {
    const result = await dbConnection.query(`
            SELECT
                P.id,
                P.nombre,
                P.apellido,
                P.telefono,
                P.edad,
                P.sexo,
                M.nombre AS municipio_nombre,
                V.direccion AS vivienda_direccion,
                P.MUNICIPIO_id,
                P.VIVIENDA_id,
                P.PERSONA_cabeza_familia_id
            FROM
                PERSONA P
            JOIN
                MUNICIPIO M ON P.MUNICIPIO_id = M.id
            JOIN
                VIVIENDA V ON P.VIVIENDA_id = V.id
        `)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error al obtener personas:', error)
    return NextResponse.json({
      message: 'Error al obtener personas',
      error: error.message
    }, { status: 500 })
  }
}
