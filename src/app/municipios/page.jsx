'use client'

import { Input, Button } from '@nextui-org/react';
import TableContent from '../components/table'
import { useState } from 'react'
import EditIcon from '../components/EditIcon'
import Formulario from '../components/form';


export default function Municipios() {
  const [search, setSearch] = useState('')
  const [estadoForm1, cambiarEstadoForm1] = useState(false);//Form para añadir
  const [estadoForm2, cambiarEstadoForm2] = useState(false);//Form para editar
  const campos = [
    { label: 'Nombre', placeholder: 'Nombre del municipio', name: 'nombre' },
    { label: 'Área', placeholder: 'Área en km²', name: 'area' },
    { label: 'Presupuesto', placeholder: 'Presupuesto anual', name: 'presupuesto' },
    { label: 'Poblacion', placeholder: 'Poblacion', name: 'poblacion' },
    { label: 'Departamento', placeholder: 'Departamento', name: 'departamento' },
  ];

  const camposEditables = [
    { label: 'Área', placeholder: 'Área en km²', name: 'area' },
    { label: 'Presupuesto', placeholder: 'Presupuesto anual', name: 'presupuesto' },
    { label: 'Poblacion', placeholder: 'Poblacion', name: 'poblacion' },
  ];

  const columns = [
    { label: 'Nombre', key: 'nombre' },
    { label: 'Area', key: 'area' },
    { label: 'Presupuesto', key: 'presupuesto' },
    { label: 'Poblacion', key: 'poblacion' },
    { label: 'Departamento', key: 'departamento' },
    { label: 'Editar', key: 'acciones' } // Cambia el nombre aquí si lo prefieres
  ]

  const data = [
    {
      id: 1,
      nombre: 'Moniquira',
      area: '1200000',
      presupuesto: '200000',
      poblacion: '200000',
      departamento: 'Boyacá'
    },
    {
      id: 2,
      nombre: 'Tunja',
      area: '1500000',
      presupuesto: '300000',
      poblacion: '500000',
      departamento: 'Boyacá'
    },
    {
      id: 3,
      nombre: 'Duitama',
      area: '1800000',
      presupuesto: '400000',
      poblacion: '350000',
      departamento: 'Boyacá'
    }
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
  const dataWithActions = data.map((municipio) => ({
    ...municipio,
    acciones: (
      <button
        onClick={() => openEditForm(municipio.id)}
        className="p-2 text-blue-500 hover:text-blue-700"
        title="Editar"
      >
        <EditIcon className="w-6 h-6" />
      </button>
    )
  }))

  const filteredData = dataWithActions.filter(municipio =>
    municipio.nombre.toLowerCase().includes(search.toLowerCase()) ||
    municipio.departamento.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className='items-center h-screen justify-items-center p-8 pb-20 gap-16 '>
      <main className="flex gap-8 justify-center w-full">
        <div className='flex flex-col justify-evenly w-1/2 items-center gap-6'>
          <h1 className='title'>
            Municipios
          </h1>
          <div className='flex flex-col gap-4 w-full'>
            <div className="flex items-center gap-4">
              <Input
                type="text"
                placeholder="Filtra por departamento o capital"
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
                Añadir Municipio
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
            titulo="Registro de Municipio"
            campos={campos}
            onSubmit={sendAddForm}
            botonTexto="Agregar Municipio"
            />
            <Formulario
            estado = {estadoForm2}
            cambiarEstado={cambiarEstadoForm2}
            titulo="Editar Municipio"
            campos={camposEditables}
            onSubmit={sendEditForm}
            botonTexto="Editar Municipio"
            />
          </div>
        </div>
      </main>
    </div>
  )
}
