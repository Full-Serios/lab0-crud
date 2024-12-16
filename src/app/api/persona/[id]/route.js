import { NextResponse } from 'next/server'
import { dbConnection } from '@/libs/mysql'

export async function PUT (request, { params }) {
  try {
    // Obtener el ID de la persona de la URL
    const { id } = params

    const body = await request.json()
    const {
      telefono,
      edad,
      MUNICIPIO_id,
      VIVIENDA_id
    } = body

    // Verificar si la persona existe
    const existingPersona = await dbConnection.query(
      'SELECT * FROM PERSONA WHERE id = ?',
      [id]
    )

    // Si no existe la persona devuelve error
    if (existingPersona.length === 0) {
      return NextResponse.json({
        message: 'No existe una persona con este ID'
      }, { status: 404 })
    }

    // Verificar si el nuevo teléfono ya está en uso por otra persona
    const telefonoExistente = await dbConnection.query(
      'SELECT * FROM PERSONA WHERE telefono = ? AND id != ?',
      [telefono, id]
    )

    // Si ya existe otro registro con ese teléfono devuelve error
    if (telefonoExistente.length > 0) {
      return NextResponse.json({
        message: 'Ya existe otra persona con este teléfono'
      }, { status: 400 })
    }

    // Verificar que la vivienda exista en el municipio
    const viviendaExistente = await dbConnection.query(
            `SELECT * FROM VIVIENDA
             WHERE id = ? AND MUNICIPIO_id = ?`,
            [VIVIENDA_id, MUNICIPIO_id]
    )

    // Si la vivienda no existe en el municipio, devuelve error
    if (viviendaExistente.length === 0) {
      return NextResponse.json({
        message: 'La vivienda no pertenece al municipio especificado'
      }, { status: 400 })
    }

    // Iniciar una transacción
    await dbConnection.query('START TRANSACTION')

    try {
      // Verificar si la persona a actualizar cambia de municipio
      const municipioOriginal = existingPersona[0].MUNICIPIO_id
      const municipioNuevo = MUNICIPIO_id

      // Actualizar la persona
      const resultPersona = await dbConnection.query(
                `UPDATE PERSONA
                SET telefono = ?, edad = ?,
                MUNICIPIO_id = ?, VIVIENDA_id = ?
                WHERE id = ?`,
                [
                  telefono,
                  edad,
                  MUNICIPIO_id,
                  VIVIENDA_id,
                  id
                ]
      )

      // Actualizar población de municipios si cambia de municipio
      if (municipioOriginal !== municipioNuevo) {
        // Decrementar población del municipio original
        await dbConnection.query(
                    `UPDATE MUNICIPIO
                    SET poblacion = poblacion - 1
                    WHERE id = ?`,
                    [municipioOriginal]
        )

        // Incrementar población del nuevo municipio
        await dbConnection.query(
                    `UPDATE MUNICIPIO
                    SET poblacion = poblacion + 1
                    WHERE id = ?`,
                    [municipioNuevo]
        )
      }

      // Confirmar la transacción
      await dbConnection.query('COMMIT')

      return NextResponse.json({
        message: 'Persona actualizada correctamente',
        updatedRows: resultPersona.affectedRows
      }, { status: 200 })
    } catch (updateError) {
      // Revertir la transacción en caso de error
      await dbConnection.query('ROLLBACK')
      throw updateError
    }
  } catch (error) {
    console.error('Error al actualizar persona:', error)
    return NextResponse.json({
      message: 'Error al actualizar persona',
      error: error.message
    }, { status: 500 })
  }
}
