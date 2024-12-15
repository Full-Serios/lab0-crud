'use client'

import { Input, Button } from '@nextui-org/react';
import TableContent from '../components/table'
import { useState } from 'react'
import EditIcon from '../components/EditIcon'
import Formulario from '../components/form';


export default function Personas() {
  const [search, setSearch] = useState('')
  const [estadoForm1, cambiarEstadoForm1] = useState(false);//Form para añadir
  const [estadoForm2, cambiarEstadoForm2] = useState(false);//Form para editar
  const campos = [
    { label: 'Nombres', placeholder: 'Nombres completos', name: 'nombres' },
    { label: 'Apellidos', placeholder: 'Apellidos completos', name: 'apellidos' },
    { label: 'Telefono', placeholder: 'Telefono', name: 'Telefono' },
    { label: 'Edad', placeholder: 'Edad', name: 'Edad' },
    { label: 'Sexo', placeholder: 'Sexo', name: 'Sexo' },
    { label: 'Municipio', placeholder: 'Municipio de residencia', name: 'Municipio' },
  ];

  const camposEditables = [
    { label: 'Telefono', placeholder: 'Telefono', name: 'Telefono' },
    { label: 'Sexo', placeholder: 'Sexo', name: 'Sexo' },
    { label: 'Municipio', placeholder: 'Municipio de residencia', name: 'Municipio' },
  ];

  const columns = [
    { label: 'Nombres', key: 'nombres' },
    { label: 'Apellidos', key: 'apellidos' },
    { label: 'Telefono', key: 'telefono' },
    { label: 'Edad', key: 'edad' },
    { label: 'Sexo', key: 'sexo' },
    { label: 'Vivienda', key: 'vivienda' },
    { label: 'Municipio', key: 'municipio' },
    { label: 'Cabeza de familia', key: 'cabeza' },
    { label: 'Editar', key: 'acciones' } // Cambia el nombre aquí si lo prefieres
  ]

  const data = [
    {
      id: 1,
      nombres: 'Felipe',
      apellidos: 'Valderrama',
      telefono: '123456789',
      edad: '68',
      sexo: 'Masculino',
      vivienda: '1',
      municipio: 'Moniquira',
      cabeza: 'si'
    },
    {
      id: 2,
      nombres: 'Felipe',
      apellidos: 'Valderrama',
      telefono: '123456789',
      edad: '68',
      sexo: 'Masculino',
      vivienda: '1',
      municipio: 'Moniquira',
      cabeza: 'si'
    },
    {
      id: 3,
      nombres: 'Felipe',
      apellidos: 'Valderrama',
      telefono: '123456789',
      edad: '68',
      sexo: 'Masculino',
      vivienda: '1',
      municipio: 'Moniquira',
      cabeza: 'si'
    },
  ]

  const openEditForm = (id) => {
    cambiarEstadoForm2(!estadoForm2)
  }

  const openAddForm = () => {
    cambiarEstadoForm1(!estadoForm1)
  }

  const sendEditForm = (id) => {
    //logica pa enviar el form al back
  }

  const sendAddForm = () => {
    //cambiarEstadoForm1(!estadoForm1)
  }
  const dataWithActions = data.map((persona) => ({
    ...persona,
    acciones: (
      <button
        onClick={() => openEditForm(persona.id)}
        className="p-2 text-blue-500 hover:text-blue-700"
        title="Editar"
      >
        <EditIcon className="w-6 h-6" />
      </button>
    )
  }))

  const filteredData = dataWithActions.filter(persona =>
    persona.apellidos.toLowerCase().includes(search.toLowerCase()) ||
    persona.municipio.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className='items-center h-screen justify-items-center p-8 pb-20 gap-16 '>
      <main className="flex gap-8 justify-center w-full">
        <div className='flex flex-col justify-evenly w-1/2 items-center gap-6'>
          <h1 className='title'>
            Personas
          </h1>
          <div className='flex flex-col gap-4 w-full'>
            <div className="flex items-center gap-4">
              <Input
                type="text"
                placeholder="Filtra por apellido o municipio"
                variant={'bordered'}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button
                onClick={openAddForm}
                className="w-1/4"
                color="primary"
                auto
              >
                Añadir Personas
              </Button>
            </div>
            <div>
              <TableContent
                columns={columns}
                data={filteredData} 
              />
            </div>
            <Formulario
            estado = {estadoForm1}
            cambiarEstado={cambiarEstadoForm1}
            titulo="Registro de Persona"
            campos={campos}
            onSubmit={sendAddForm}
            botonTexto="Agregar Persona"
            />
            <Formulario
            estado = {estadoForm2}
            cambiarEstado={cambiarEstadoForm2}
            titulo="Editar Persona"
            campos={camposEditables}
            onSubmit={sendEditForm}
            botonTexto="Editar Persona"
            />
          </div>
        </div>
      </main>
    </div>
  )
}
