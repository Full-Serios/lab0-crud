'use client'

import { Input, Button } from '@nextui-org/react'
import TableContent from '../components/table'
import { useEffect, useState } from 'react'
import EditIcon from '../components/EditIcon'
import Formulario from '../components/form'
import axios from 'axios'

export default function Barrios () {
  const [search, setSearch] = useState('')
  const [estadoForm1, cambiarEstadoForm1] = useState(false)// Form para añadir
  const [estadoForm2, cambiarEstadoForm2] = useState(false)// Form para editar

  const [barrios, setBarrios] = useState([])
  const [barrioToEdit, setBarrioToEdit] = useState(null)

  const [isLoading, setIsLoading] = useState(true)

  const [campos, setCampos] = useState(
    [
      {
        label: 'Nombre',
        placeholder: 'Nombre del barrio',
        name: 'nombre',
        type: 'text',
        validations: {
          required: {
            value: true,
            message: 'Este campo es requerido'
          }
        }
      },
      {
        label: 'Tipo',
        placeholder: 'Tipo de barrio',
        name: 'tipo',
        type: 'select',
        options: [
          { id: 'Urbano', name: 'Urbano' },
          { id: 'Rural', name: 'Rural' }
        ]
      },
      {
        label: 'Municipio',
        placeholder: 'Municipio donde se encuentra el barrio',
        name: 'MUNICIPIO_id',
        type: 'select',
        options: [],
        validations: {
          required: {
            value: true,
            message: 'Este campo es requerido'
          }
        }
      }
    ]
  )

  // Fetch barrios
  useEffect(() => {
    const loadBarrios = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}barrio`)
        setBarrios(res.data)
      } catch (error) {
        console.error('Error al obtener barrios: ', error)
      }
    }

    loadBarrios()
    setIsLoading(false)
  }, [])

  // Fetch municipios options
  useEffect(() => {
    const loadMunicipios = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}municipio`)
        const municipiosData = res.data

        const options = municipiosData.map((muni) => ({
          id: muni.id,
          name: muni.nombre
        }))

        setCampos((prevCampos) =>
          prevCampos.map((campo) =>
            campo.name === 'MUNICIPIO_id'
              ? { ...campo, options }
              : campo
          )
        )
      } catch (error) {
        console.error('Error al obtener municipios: ', error)
      }
    }

    loadMunicipios()
  }, [])

  const camposEditables = campos.filter(campo =>
    campo.name === 'nombre' || campo.name === 'tipo'
  )

  const columns = [
    { label: 'Nombre', key: 'nombre' },
    { label: 'Tipo', key: 'tipo' },
    { label: 'Municipio', key: 'municipio' },
    { label: 'Editar', key: 'acciones' }
  ]

  const openEditForm = (barrio) => {
    cambiarEstadoForm2(!estadoForm2)
    setBarrioToEdit(barrio)
  }

  const openAddForm = () => {
    cambiarEstadoForm1(!estadoForm1)
  }

  const sendEditForm = async (data) => {
    try {
      const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}barrio/${data.id}`, data, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      return { type: 'success', message: res.data.message }
    } catch (error) {
      return { type: 'error', message: 'Error al editar el barrio' }
    }
  }

  const sendAddForm = async (data) => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}barrio`, data, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      return { type: 'success', message: res.data.message }
    } catch (error) {
      return { type: 'error', message: 'Error al registrar el barrio' }
    }
  }

  const dataWithActions = barrios.map((barrio) => ({
    ...barrio,
    acciones: (
      <button
        onClick={() => openEditForm(barrio)}
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
    <div className='items-center h-screen justify-items-center p-8 pb-20 gap-16 overflow-y-auto scrollbar-hide'>
      <main className="flex gap-8 justify-center w-full">
        <div className='flex flex-col justify-evenly w-5/6 items-center gap-6'>
          <h1 className='title'>
            Barrios
          </h1>
          <div className='flex flex-col gap-4 w-full'>
            <div className="flex items-center gap-4">
              <Input
                type="text"
                placeholder="Busca por barrio o municipio"
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
                isLoading={isLoading}
              />
            </div>
            <Formulario
            estado = {estadoForm1}
            cambiarEstado={cambiarEstadoForm1}
            titulo="Registro de Barrio"
            campos={campos}
            action={sendAddForm}
            botonTexto="Agregar Barrio"
            />
            <Formulario
            estado = {estadoForm2}
            cambiarEstado={cambiarEstadoForm2}
            titulo="Editar Barrio"
            campos={camposEditables}
            values={barrioToEdit}
            action={sendEditForm}
            botonTexto="Editar Barrio"
            />
          </div>
        </div>
      </main>
    </div>
  )
}
