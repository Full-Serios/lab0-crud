'use client'

import { Input, Button } from '@nextui-org/react'
import TableContent from '../components/table'
import { useEffect, useState } from 'react'
import EditIcon from '../components/EditIcon'
import Formulario from '../components/form'
import axios from 'axios'

export default function Viviendas () {
  const [search, setSearch] = useState('')
  const [estadoForm1, cambiarEstadoForm1] = useState(false)// Form para añadir
  const [estadoForm2, cambiarEstadoForm2] = useState(false)// Form para editar

  const [viviendas, setViviendas] = useState([])
  const [viviendaToEdit, setViviendaToEdit] = useState(null)

  const [isLoading, setIsLoading] = useState(true)

  const [municipioSelect, setMunicipioSelect] = useState(0)
  const [campos, setCampos] = useState(
    [
      {
        label: 'Direccion',
        placeholder: 'Direccion de la vivienda',
        name: 'direccion',
        type: 'text',
        validations: {
          required: {
            value: true,
            message: 'Este campo es requerido'
          }
        }
      },
      {
        label: 'Capacidad',
        placeholder: 'Capacidad de la vivienda',
        name: 'capacidad',
        type: 'number',
        validations: {
          min: {
            value: 1,
            message: 'La capacidad no puede ser menor que 1'
          },
          max: {
            value: 20,
            message: 'La capacidad no puede ser mayor que 20'
          },
          validate: {
            isInteger: value =>
              Number.isInteger(Number(value)) || 'El número debe ser un entero'
          }
        }
      },
      {
        label: 'Niveles',
        placeholder: 'Niveles',
        name: 'niveles',
        type: 'number',
        validations: {
          min: {
            value: 1,
            message: 'Los niveles no pueden ser menor que 1'
          },
          max: {
            value: 20,
            message: 'Los niveles no pueden ser mayor que 20'
          },
          validate: {
            isInteger: value =>
              Number.isInteger(Number(value)) || 'El número debe ser un entero'
          }
        }
      },
      {
        label: 'Tipo',
        placeholder: 'Casa o apartamento',
        name: 'tipo',
        type: 'select',
        options: [
          { id: 'Casa', name: 'Casa' },
          { id: 'Apartamento', name: 'Apartamento' }
        ]
      },
      {
        label: 'Estrato',
        placeholder: 'Estrato de la vivienda',
        name: 'estrato',
        type: 'number',
        validations: {
          min: {
            value: 1,
            message: 'El estrato no puede ser menor que 1'
          },
          max: {
            value: 6,
            message: 'El estrato no puede ser mayor que 6'
          },
          validate: {
            isInteger: value =>
              Number.isInteger(Number(value)) || 'El número debe ser un entero'
          }
        }
      },
      {
        label: 'Municipio',
        placeholder: 'Municipio donde se ubica la vivienda',
        name: 'MUNICIPIO_id',
        type: 'select',
        options: [],
        validations: {
          required: {
            value: true,
            message: 'Este campo es requerido'
          }
        }
      },
      {
        label: 'Barrio',
        placeholder: 'Barrio donde se ubica la vivienda',
        name: 'BARRIO_id',
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

  const loadViviendas = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}vivienda`)
      setViviendas(res.data)
    } catch (error) {
      console.error('Error al obtener viviendas: ', error)
    }
  }

  const loadBarrios = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}barrio`)
      const barriosData = res.data

      const options = barriosData.map((bar) => ({
        id: bar.id,
        name: bar.nombre
      }))

      setCampos((prevCampos) =>
        prevCampos.map((campo) =>
          campo.name === 'BARRIO_id'
            ? { ...campo, options }
            : campo
        )
      )
    } catch (error) {
      console.error('Error al obtener barrios: ', error)
    }
  }

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

  useEffect(() => {
    const fetchData = async () => {
      await loadMunicipios()
      await loadViviendas()
      setIsLoading(false)
    }

    fetchData()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      if (municipioSelect) {
        await loadBarrios(municipioSelect)
      }
    }

    fetchData()
  }, [municipioSelect])
  const camposEditables = campos.filter(campo =>
    campo.name === 'capacidad' || campo.name === 'niveles' || campo.name === 'tipo' || campo.name === 'estrato'
  )

  const columns = [
    { label: 'Direccion', key: 'direccion' },
    { label: 'Capacidad', key: 'capacidad' },
    { label: 'Niveles', key: 'niveles' },
    { label: 'Tipo', key: 'tipo' },
    { label: 'Estrato', key: 'estrato' },
    { label: 'Barrio', key: 'barrio_nombre' },
    { label: 'Municipio', key: 'municipio_nombre' },
    { label: 'Editar', key: 'acciones' }
  ]

  const openEditForm = (vivienda) => {
    cambiarEstadoForm2(!estadoForm2)
    setViviendaToEdit(vivienda)
  }

  const openAddForm = () => {
    cambiarEstadoForm1(!estadoForm1)
  }

  const sendEditForm = async (data) => {
    try {
      const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}vivienda/${data.id}`, data, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      return { type: 'success', message: res.data.message }
    } catch (error) {
      return { type: 'error', message: 'Error al editar la vivienda' }
    }
  }

  const sendAddForm = async (data) => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}vivienda`, data, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      return { type: 'success', message: res.data.message }
    } catch (error) {
      return { type: 'error', message: 'Error al registrar la vivienda' }
    }
  }

  const dataWithActions = viviendas.map((vivienda) => ({
    ...vivienda,
    acciones: (
      <button
        onClick={() => openEditForm(vivienda)}
        className="p-2 text-blue-500 hover:text-blue-700"
        title="Editar"
      >
        <EditIcon className="w-6 h-6" />
      </button>
    )
  }))

  const filteredData = dataWithActions.filter(vivienda =>
    vivienda.direccion.toLowerCase().includes(search.toLowerCase()) ||
    vivienda.tipo.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className='items-center h-screen justify-items-center p-8 pb-20 gap-16 overflow-y-auto'>
      <main className="flex gap-8 justify-center w-full">
        <div className='flex flex-col justify-evenly w-5/6 items-center gap-6'>
          <h1 className='title'>
            Viviendas
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
                Añadir Vivienda
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
            titulo="Registro de Vivienda"
            campos={campos}
            action={sendAddForm}
            botonTexto="Agregar Vivienda"
            setSelect={setMunicipioSelect}
            />
            <Formulario
            estado = {estadoForm2}
            cambiarEstado={cambiarEstadoForm2}
            titulo="Editar Vivienda"
            campos={camposEditables}
            values={viviendaToEdit}
            action={sendEditForm}
            botonTexto="Editar Vivienda"
            setSelect={setMunicipioSelect}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
