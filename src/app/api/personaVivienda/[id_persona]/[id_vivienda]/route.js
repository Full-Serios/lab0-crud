import { NextResponse } from 'next/server'
import { dbConnection } from '@/libs/mysql'

export async function PUT (request, { params }) {
  try {
    const id_persona = params.id_persona
    const id_vivienda = params.id_vivienda
    const body = await request.json()
    const {
      PERSONA_id,
      VIVIENDA_id
    } = body

    // Verificar si se quiere actualizar la vivienda
    if (VIVIENDA_id) {
      // Verificar si la vivienda ya tiene propietario
      const existingOwnerProperty = await dbConnection.query(
        'SELECT * FROM PERSONA_has_VIVIENDA WHERE VIVIENDA_id = ?',
        [VIVIENDA_id]
      )

      // Si la vivienda ya tiene propietario, no se puede actualizar
      if (existingOwnerProperty.length > 0) {
        return NextResponse.json({
          message: 'Esta vivienda ya tiene propietario'
        }, { status: 400 })
      }
    }

    // Verificar si se quiere actualizar el PERSONA_id
    if (PERSONA_id) {
      // Permitir actualizar el PERSONA_id sin restricciones adicionales
      const result = await dbConnection.query(
        `UPDATE PERSONA_has_VIVIENDA
        SET PERSONA_id = ?,
        fecha_adquisicion = CURRENT_TIMESTAMP
        WHERE VIVIENDA_id = ?`,
        [
          PERSONA_id,
          id_vivienda
        ]
      )

      // Verificar si se actualizó algún registro
      if (result.affectedRows === 0) {
        return NextResponse.json({
          message: 'No se pudo actualizar el propietario'
        }, { status: 400 })
      }
    }

    // Si se quiere actualizar ambos (PERSONA_id y VIVIENDA_id)
    if (PERSONA_id && VIVIENDA_id) {
      const result = await dbConnection.query(
        `UPDATE PERSONA_has_VIVIENDA
        SET PERSONA_id = ?,
        VIVIENDA_id = ?,
        fecha_adquisicion = CURRENT_TIMESTAMP
        WHERE VIVIENDA_id = ? AND PERSONA_id = ?`,
        [
          PERSONA_id,
          VIVIENDA_id,
          id_vivienda,
          id_persona
        ]
      )

      // Verificar si se actualizó algún registro
      if (result.affectedRows === 0) {
        return NextResponse.json({
          message: 'No se pudo actualizar el propietario'
        }, { status: 400 })
      }
    }

    return NextResponse.json({
      message: 'Propietario actualizado correctamente'
    }, { status: 200 })
  } catch (error) {
    console.error('Error al actualizar propietario:', error)
    return NextResponse.json({
      message: 'Error al actualizar propietario',
      error: error.message
    }, { status: 500 })
  }
}

export async function DELETE (request, { params }) {
  try {
    const id_persona = params.id_persona
    const id_vivienda = params.id_vivienda

    // Verifica si existe el registro de propiedad para la persona y vivienda específicas
    const existingOwner = await dbConnection.query(
      'SELECT * FROM PERSONA_has_VIVIENDA WHERE PERSONA_id = ? AND VIVIENDA_id = ?',
      [
        id_persona,
        id_vivienda
      ]
    )

    // Si no existe el registro, devuelve un error
    if (existingOwner.length === 0) {
      return NextResponse.json({
        message: 'No existe un registro de propiedad para esta persona y vivienda'
      }, { status: 404 })
    }

    // Verifica si existe el registro de propiedad
    const existingUser = await dbConnection.query(
      'SELECT * FROM PERSONA WHERE VIVIENDA_id = ?',
      [id_vivienda]
    )

    if (existingOwner.length !== 0) {
      return NextResponse.json({
        message: 'La vivienda no debe tener personas viviendo en ella'
      }, { status: 404 })
    }

    await dbConnection.beginTransaction()

    try {
      // Eliminar el registro de PERSONA_has_VIVIENDA
      const deleteResult = await dbConnection.query(
        `DELETE FROM PERSONA_has_VIVIENDA
        WHERE PERSONA_id = ? AND VIVIENDA_id = ?`,
        [id_persona, id_vivienda]
      )

      // Actualizar los campos en la tabla PERSONA
      const updateResult = await dbConnection.query(
        `UPDATE PERSONA
          SET PERSONA_cabeza_familia_id = NULL
         WHERE id = ?`,
        [id_persona]
      )

      // Confirmar la transacción
      await dbConnection.commit()

      if (deleteResult.affectedRows === 0) {
        return NextResponse.json({
          message: 'No se pudo eliminar el registro de propiedad'
        }, { status: 400 })
      }

      return NextResponse.json({
        message: 'Registro de propiedad eliminado y datos de persona actualizados correctamente'
      }, { status: 200 })
    } catch (error) {
      // Si hay algún error, revertir la transacción
      await dbConnection.rollback()
      throw error
    }
  } catch (error) {
    console.error('Error al eliminar registro de propiedad:', error)
    return NextResponse.json({
      message: 'Error al eliminar registro de propiedad',
      error: error.message
    }, { status: 500 })
  }
}
