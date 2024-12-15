'use client'

import { Input, Button } from '@nextui-org/react'
import TableContent from '../components/table'
import { useState } from 'react'
import EditIcon from '../components/EditIcon'
import Formulario from '../components/form'

export default function Barrios () {
  const [search, setSearch] = useState('')
  const [estadoForm1, cambiarEstadoForm1] = useState(false)// Form para añadir
  const [estadoForm2, cambiarEstadoForm2] = useState(false)// Form para editar

  const campos = [
    { label: 'Nombre', placeholder: 'Nombre del barrio', name: 'nombre' },
    { label: 'Tipo', placeholder: 'Tipo de barrio', name: 'area' },
    { label: 'Municipio', placeholder: 'Municipio donde se encuentra el barrio', name: 'municipio' }
  ]

  const camposEditables = [
    { label: 'Nombre', placeholder: 'Nombre del barrio', name: 'nombre' },
    { label: 'Tipo', placeholder: 'Tipo de barrio', name: 'tipo' }
  ]

  const columns = [
    { label: 'Nombre', key: 'nombre' },
    { label: 'Tipo', key: 'tipo' },
    { label: 'Municipio', key: 'municipio' },
    { label: 'Editar', key: 'acciones' }

  ]

  const data = [
    {
      id: 1,
      nombre: 'Ricaurte',
      tipo: 'Urbano',
      municipio: 'Moniquira'
    },
    {
      id: 2,
      nombre: 'Ricaurte',
      tipo: 'Urbano',
      municipio: 'Moniquira'
    },
    {
      id: 3,
      nombre: 'Ricaurte',
      tipo: 'Urbano',
      municipio: 'Moniquira'
    }
  ]

  const openEditForm = (id) => {
    cambiarEstadoForm2(!estadoForm2)
  }

  const openAddForm = () => {
    cambiarEstadoForm1(!estadoForm1)
  }

  const sendEditForm = (id) => {
    // logica pa enviar el form al back
  }

  const sendAddForm = () => {
    // cambiarEstadoForm1(!estadoForm1)
  }
  const dataWithActions = data.map((barrio) => ({
    ...barrio,
    acciones: (
      <button
        onClick={() => openEditForm(barrio.id)}
        className="p-2 text-blue-500 hover:text-blue-700"
        title="Editar"
      >
        <EditIcon className="w-6 h-6" />
      </button>
    )
  }))

  const filteredData = dataWithActions.filter(barrio =>
    barrio.nombre.toLowerCase().includes(search.toLowerCase()) ||
    barrio.municipio.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className='items-center h-screen justify-items-center p-8 pb-20 gap-16 '>
      <main className="flex gap-8 justify-center w-full">
        <div className='flex flex-col justify-evenly w-1/2 items-center gap-6'>
          <h1 className='title'>
            Barrios
          </h1>
          <div className='flex flex-col gap-4 w-full'>
            <div className="flex items-center gap-4">
              <Input
                type="text"
                placeholder="Filtra por barrio o municipio"
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
                Añadir Barrio
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
            titulo="Registro de Barrio"
            campos={campos}
            onSubmit={sendAddForm}
            botonTexto="Agregar Barrio"
            />
            <Formulario
            estado = {estadoForm2}
            cambiarEstado={cambiarEstadoForm2}
            titulo="Editar Barrio"
            campos={camposEditables}
            onSubmit={sendEditForm}
            botonTexto="Editar Barrio"
            />
          </div>
        </div>
      </main>
    </div>
  )
}
