import { NextResponse } from 'next/server'
import { dbConnection } from '@/libs/mysql'

export async function PUT (request, { params }) {
  try {
    const id = await params.id
    const body = await request.json()
    const {
      area_km2,
      presupuesto,
      poblacion
    } = body

    const result = await dbConnection.query(
            `UPDATE MUNICIPIO
            SET
                area_km2 = ?,
                presupuesto = ?,
                poblacion = ?
            WHERE id = ?`,
            [
              area_km2,
              presupuesto,
              poblacion,
              id
            ]
    )

    if (result.affectedRows === 0) {
      return NextResponse.json({
        message: 'Municipio no encontrado'
      }, { status: 404 })
    }

    return NextResponse.json({
      message: 'Municipio actualizado correctamente',
      changes: result.changedRows
    }, { status: 200 })
  } catch (error) {
    console.error('Error al actualizar municipio:', error)
    return NextResponse.json({
      message: 'Error al actualizar municipio',
      error: error.message
    }, { status: 500 })
  }
}

// export async function DELETE(request, { params }) {
//     try {
//         const id = await params.id;

//         const result = await dbConnection.query(
//             `DELETE FROM MUNICIPIO WHERE id = ?;`,
//             [
//                 id
//             ]
//         );

//         if (result.affectedRows === 0) {
//             return NextResponse.json({
//                 message: "Municipio no encontrado"
//             }, { status: 404 });
//         }

//         return NextResponse.json({
//             message: "Municipio eliminado correctamente",
//             changes: result.changedRows
//         }, { status: 200 });

//     } catch (error) {
//         console.error("Error al actualizar municipio:", error);
//         return NextResponse.json({
//             message: "Error al actualizar municipio",
//             error: error.message
//         }, { status: 500 });
//     }
// }
