import { NextResponse } from "next/server";
import { dbConnection } from "@/libs/mysql";

export async function PUT(request, { params }) {
    try {
        const { id } = params;

        const body = await request.json();
        const {
            capacidad,
            niveles,
            tipo,
            estrato
        } = body;

        // Verifica si existe la vivienda que se quiere actualizar
        const existingVivienda = await dbConnection.query(
            `SELECT * FROM VIVIENDA WHERE id = ?`,
            [id]
        );

        // Si no existe la vivienda devuelve error
        if (existingVivienda.length === 0) {
            return NextResponse.json({
                message: "No existe una vivienda con este ID"
            }, { status: 404 });
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
        );

        return NextResponse.json({
            message: "Vivienda actualizada correctamente",
            updatedRows: result.affectedRows
        }, { status: 200 });

    } catch (error) {
        console.error("Error al actualizar vivienda:", error);
        return NextResponse.json({
            message: "Error al actualizar vivienda",
            error: error.message
        }, { status: 500 });
    }
}