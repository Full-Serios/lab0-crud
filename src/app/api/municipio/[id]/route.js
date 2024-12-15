import { NextResponse } from "next/server";
import { dbConnection } from "@/libs/mysql";

export async function PUT(request, { params }) {
    try {
        const id = await params.id;
        const body = await request.json();
        const {
            nombre,
            area_km2,
            presupuesto,
            poblacion
        } = body;

        const result = await dbConnection.query(
            `UPDATE MUNICIPIO 
            SET 
                nombre = ?, 
                area_km2 = ?, 
                presupuesto = ?, 
                poblacion = ?
            WHERE id = ?`, 
            [
                nombre, 
                area_km2, 
                presupuesto, 
                poblacion,
                id
            ]
        );

        if (result.affectedRows === 0) {
            return NextResponse.json({
                message: "Municipio no encontrado"
            }, { status: 404 });
        }

        return NextResponse.json({
            message: "Municipio actualizado correctamente",
            changes: result.changedRows
        }, { status: 200 });

    } catch (error) {
        console.error("Error al actualizar municipio:", error);
        return NextResponse.json({
            message: "Error al actualizar municipio",
            error: error.message
        }, { status: 500 });
    }
}