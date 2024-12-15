import { NextResponse } from 'next/server'
import { dbConnection } from '@/libs/mysql'

export async function PUT (request, { params }) {
  try {
    const id = await params.id
    const body = await request.json()
    const {
      nombre,
      tipo
    } = body

    const result = await dbConnection.query(
            `UPDATE BARRIO
            SET
                nombre = ?,
                tipo = ?
            WHERE id = ?`,
            [
              nombre,
              tipo,
              id
            ]
    )

    if (result.affectedRows === 0) {
      return NextResponse.json({
        message: 'Barrio no encontrado'
      }, { status: 404 })
    }

    return NextResponse.json({
      message: 'Barrio actualizado correctamente',
      changes: result.changedRows
    }, { status: 200 })
  } catch (error) {
    console.error('Error al actualizar barrio:', error)
    return NextResponse.json({
      message: 'Error al actualizar barrio',
      error: error.message
    }, { status: 500 })
  }
}
