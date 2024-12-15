import { NextResponse } from "next/server";
import { dbConnection } from "@/libs/mysql";

export async function POST(request) {
    try {
        const body = await request.json();
        const {
            direccion,
            capacidad,
            niveles,
            tipo,
            estrato,
            BARRIO_id,
            MUNICIPIO_id
        } = body;

        // Verifica si ya existe una vivienda con esa direccion
        const existingMunicipio = await dbConnection.query(
            `SELECT * FROM VIVIENDA WHERE direccion = ? AND tipo = 'Casa' AND BARRIO_id = ? AND MUNICIPIO_id = ?`,
            [
                direccion,
                BARRIO_id,
                MUNICIPIO_id
            ]
        );

        // Si ya existe devuelve error
        if (existingMunicipio.length > 0) {
            return NextResponse.json({
                message: "Ya existe una vivienda con esta direccion"
            }, { status: 400 });
        }

        // Si no existe hace la inserción
        const result = await dbConnection.query(
            `INSERT INTO VIVIENDA
            (direccion, capacidad, niveles, tipo, estrato, BARRIO_id, MUNICIPIO_id)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                direccion,
                capacidad,
                niveles,
                tipo,
                estrato,
                BARRIO_id,
                MUNICIPIO_id
            ]
        );

        return NextResponse.json({
            message: "Vivienda insertado correctamente",
            insertId: result.insertId
        }, { status: 201 });

    } catch (error) {
        console.error("Error al insertar vivienda:", error);
        return NextResponse.json({
            message: "Error al insertar vivienda",
            error: error.message
        }, { status: 500 });
    }
}

export async function GET() {
    try {
        const result = await dbConnection.query(`SELECT * FROM VIVIENDA`);
        return NextResponse.json(result);

    } catch (error) {
        console.error("Error al obtener viviendas:", error);
        return NextResponse.json({
            message: "Error al obtener viviendas",
            error: error.message
        }, { status: 500 });
    }
}