'use client'

import { Input, Button } from '@nextui-org/react'
import TableContent from '../components/table'
import { useState } from 'react'
import EditIcon from '../components/EditIcon'
import Formulario from '../components/form'

export default function Viviendas () {
  const [search, setSearch] = useState('')
  const [estadoForm1, cambiarEstadoForm1] = useState(false)// Form para añadir
  const [estadoForm2, cambiarEstadoForm2] = useState(false)// Form para editar
  const campos = [
    { label: 'Direccion', placeholder: 'Direccion de la vivienda', name: 'direccion' },
    { label: 'Capacidad', placeholder: 'Capacidad de la vivienda', name: 'capacidad' },
    { label: 'Niveles', placeholder: 'Niveles', name: 'niveles' },
    { label: 'Tipo', placeholder: 'Casa o apartamento', name: 'tipo' },
    { label: 'Estrato', placeholder: 'Estrato de la vivienda', name: 'estrato' },
    { label: 'Barrio', placeholder: 'Barrio donde se ubica la vivienda', name: 'barrio' },
    { label: 'Municipio', placeholder: 'Municipio donde se ubica la vivienda', name: 'municipio' }
  ]

  const camposEditables = [
    { label: 'Capacidad', placeholder: 'Capacidad de la vivienda', name: 'capacidad' },
    { label: 'Niveles', placeholder: 'Niveles', name: 'niveles' },
    { label: 'Tipo', placeholder: 'Casa o apartamento', name: 'tipo' },
    { label: 'Estrato', placeholder: 'Estrato de la vivienda', name: 'estrato' }

  ]

  const columns = [
    { label: 'Direccion', key: 'direccion' },
    { label: 'Capacidad', key: 'capacidad' },
    { label: 'Niveles', key: 'niveles' },
    { label: 'Tipo', key: 'tipo' },
    { label: 'Estrato', key: 'estrato' },
    { label: 'Barrio', key: 'barrio' }, // Cambia el nombre aquí si lo prefieres
    { label: 'Municipio', key: 'municipio' }, // Cambia el nombre aquí si lo prefieres
    { label: 'Editar', key: 'acciones' } // Cambia el nombre aquí si lo prefieres

  ]

  const data = [
    {
      id: 1,
      direccion: 'Calle 20c #10',
      capacidad: '5',
      niveles: '2',
      tipo: 'Casa',
      estrato: '2',
      barrio: 'Ricaurte',
      municipio: 'Moniquira'
    },
    {
      id: 2,
      direccion: 'Calle 20c #10',
      capacidad: '5',
      niveles: '2',
      tipo: 'Casa',
      estrato: '2',
      barrio: 'Ricaurte',
      municipio: 'Moniquira'
    },
    {
      id: 3,
      direccion: 'Calle 20c #10',
      capacidad: '5',
      niveles: '2',
      tipo: 'Casa',
      estrato: '2',
      barrio: 'Ricaurte',
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
  const dataWithActions = data.map((vivienda) => ({
    ...vivienda,
    acciones: (
      <button
        onClick={() => openEditForm(vivienda.id)}
        className="p-2 text-blue-500 hover:text-blue-700"
        title="Editar"
      >
        <EditIcon className="w-6 h-6" />
      </button>
    )
  }))

  const filteredData = dataWithActions.filter(vivienda =>
    vivienda.barrio.toLowerCase().includes(search.toLowerCase()) ||
    vivienda.municipio.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className='items-center h-screen justify-items-center p-8 pb-20 gap-16 '>
      <main className="flex gap-8 justify-center w-full">
        <div className='flex flex-col justify-evenly w-1/2 items-center gap-6'>
          <h1 className='title'>
            Viviendas
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
                Añadir Vivienda
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
            titulo="Registro de Vivienda"
            campos={campos}
            onSubmit={sendAddForm}
            botonTexto="Agregar Vivienda"
            />
            <Formulario
            estado = {estadoForm2}
            cambiarEstado={cambiarEstadoForm2}
            titulo="Editar Vivienda"
            campos={camposEditables}
            onSubmit={sendEditForm}
            botonTexto="Editar Vivienda"
            />
          </div>
        </div>
      </main>
    </div>
  )
}
