'use client'

import { Input, Button } from '@nextui-org/react';
import TableContent from '../components/table'
import { useState } from 'react'
import EditIcon from '../components/EditIcon'


export default function Municipios() {
  const [search, setSearch] = useState('')

  const columns = [
    { label: 'Nombre', key: 'nombre' },
    { label: 'Area', key: 'area' },
    { label: 'Presupuesto', key: 'presupuesto' },
    { label: 'Poblacion', key: 'poblacion' },
    { label: 'Departamento', key: 'departamento' },
    { label: 'Acciones', key: 'acciones' } // Cambia el nombre aquí si lo prefieres
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

  const handleEdit = (id) => {
    console.log(`Editar municipio con ID: ${id}`)
  }

  const handleAddMunicipio = () => {
    console.log("Añadir un nuevo municipio")
  }

  const dataWithActions = data.map((municipio) => ({
    ...municipio,
    acciones: (
      <button
        onClick={() => handleEdit(municipio.id)}
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
                onClick={handleAddMunicipio}
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
          </div>
        </div>
      </main>
    </div>
  )
}
