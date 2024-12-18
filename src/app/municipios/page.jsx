'use client'

import { Input, Button } from '@nextui-org/react'
import TableContent from '../components/table'
import { useEffect, useState } from 'react'
import EditIcon from '../components/EditIcon'
import Formulario from '../components/form'
import axios from 'axios'

export default function Municipios () {
  const [search, setSearch] = useState('')
  const [estadoForm1, cambiarEstadoForm1] = useState(false)// Form para añadir
  const [estadoForm2, cambiarEstadoForm2] = useState(false)// Form para editar

  const [municipios, setMunicipios] = useState([])
  const [municipioToEdit, setMunicipioToEdit] = useState(null)

  const [isLoading, setIsLoading] = useState(true)

  const [campos, setCampos] = useState(
    [
      {
        label: 'Nombre',
        placeholder: 'Nombre del municipio',
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
        label: 'Área',
        placeholder: 'Área en km²',
        name: 'area_km2',
        type: 'number',
        validations: {
          min: {
            value: 1,
            message: 'El área debe ser mayor a 0'
          }
        }
      },
      {
        label: 'Presupuesto',
        placeholder: 'Presupuesto anual',
        name: 'presupuesto',
        type: 'number',
        validations: {
          min: {
            value: 1,
            message: 'El presupuesto debe ser mayor a 0'
          }
        }
      },
      {
        label: 'Poblacion',
        placeholder: 'Poblacion',
        name: 'poblacion',
        type: 'number',
        validations: {
          min: {
            value: 1,
            message: 'La población debe ser mayor a 0'
          },
          validate: {
            isInteger: value =>
              Number.isInteger(Number(value)) || 'El número debe ser un entero'
          }
        }
      },
      {
        label: 'Departamento',
        placeholder: 'Departamento',
        name: 'DEPARTAMENTO_id',
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

  useEffect(() => {
    const loadMunicipios = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}municipio`)
        setMunicipios(res.data)
      } catch (error) {
        console.error('Error al obtener municipios: ', error)
      }
    }

    loadMunicipios()
    setIsLoading(false)
  }, [])

  useEffect(() => {
    const loadDepartamentos = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}departamento`)
        const departamentosData = res.data

        const options = departamentosData.map((dept) => ({
          id: dept.id,
          name: dept.nombre
        }))

        setCampos((prevCampos) =>
          prevCampos.map((campo) =>
            campo.name === 'DEPARTAMENTO_id'
              ? { ...campo, options }
              : campo
          )
        )
      } catch (error) {
        console.error('Error al obtener departamentos: ', error)
      }
    }

    loadDepartamentos()
  }, [])

  const columns = [
    { label: 'Nombre', key: 'nombre' },
    { label: 'Area', key: 'area_km2' },
    { label: 'Presupuesto', key: 'presupuesto' },
    { label: 'Poblacion', key: 'poblacion' },
    { label: 'Departamento', key: 'departamento' },
    { label: 'Editar', key: 'acciones' }
  ]

  const camposEditables = campos.filter(campo =>
    campo.name === 'area_km2' || campo.name === 'presupuesto' || campo.name === 'poblacion'
  )

  const openEditForm = (municipio) => {
    cambiarEstadoForm2(!estadoForm2)
    setMunicipioToEdit(municipio)
  }

  const openAddForm = () => {
    cambiarEstadoForm1(!estadoForm1)
  }

  const sendEditForm = async (data) => {
    try {
      const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}municipio/${data.id}`, data, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      return { type: 'success', message: res.data.message }
    } catch (error) {
      return { type: 'error', message: 'Error al editar el municipio' }
    }
  }

  const sendAddForm = async (data) => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}municipio`, data, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      return { type: 'success', message: res.data.message }
    } catch (error) {
      return { type: 'error', message: 'Error al registrar el municipio' }
    }
  }

  const dataWithActions = municipios.map((municipio) => ({
    ...municipio,
    acciones: (
      <button
        onClick={() => openEditForm(municipio)}
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
    <div className='items-center h-screen justify-items-center p-8 pb-20 gap-16 overflow-y-auto scrollbar-hide'>
      <main className="flex gap-8 justify-center w-full">
        <div className='flex flex-col justify-evenly w-5/6 items-center gap-6'>
          <h1 className='title'>
            Municipios
          </h1>
          <div className='flex flex-col gap-4 w-full'>
            <div className="flex items-center gap-4">
              <Input
                type="text"
                placeholder="Busca por departamento o capital"
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
                isLoading={isLoading}
              />
            </div>
            <Formulario
            estado = {estadoForm1}
            cambiarEstado={cambiarEstadoForm1}
            titulo="Registro de Municipio"
            campos={campos}
            action={sendAddForm}
            botonTexto="Agregar Municipio"
            />
            <Formulario
            estado = {estadoForm2}
            cambiarEstado={cambiarEstadoForm2}
            titulo="Editar Municipio"
            campos={camposEditables}
            values={municipioToEdit}
            action={sendEditForm}
            botonTexto="Editar Municipio"
            />
          </div>
        </div>
      </main>
    </div>
  )
}
