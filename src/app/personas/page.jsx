'use client'

import { Input, Button } from '@nextui-org/react'
import TableContent from '../components/table'
import { useEffect, useState } from 'react'
import EditIcon from '../components/EditIcon'
import Formulario from '../components/form'
import axios from 'axios'

export default function Personas () {
  const [search, setSearch] = useState('')
  const [estadoForm1, cambiarEstadoForm1] = useState(false)// Form para añadir
  const [estadoForm2, cambiarEstadoForm2] = useState(false)// Form para editar

  const [personaToEdit, setPersonaToEdit] = useState(null)
  const [personas, setPersonas] = useState([])

  const [isLoading, setIsLoading] = useState(true)

  const [municipioSelect, setMunicipioSelect] = useState(0)
  const [campos, setCampos] = useState(
    [
      {
        label: 'Documento Identidad',
        placeholder: 'Número de documento',
        name: 'id',
        type: 'number',
        validations: {
          required: {
            value: true,
            message: 'Este campo es requerido'
          },
          validate: {
            isInteger: value =>
              Number.isInteger(Number(value)) || 'El número debe ser un entero'
          },
          minLength: {
            value: 8,
            message: 'El número debe tener al menos 8 dígitos'
          },
          maxLength: {
            value: 10,
            message: 'El número no puede tener más de 10 dígitos'
          }
        }
      },
      {
        label: 'Nombres',
        placeholder: 'Nombres completos',
        name: 'nombre',
        type: 'text',
        validations: {
          required: {
            value: true,
            message: 'Este campo es requerido'
          },
          pattern: {
            value: /^[a-zA-Z\s]+$/,
            message: 'El nombre solo puede contener letras y espacios'
          }
        }
      },
      {
        label: 'Apellidos',
        placeholder: 'Apellidos completos',
        name: 'apellido',
        type: 'text',
        validations: {
          required: {
            value: true,
            message: 'Este campo es requerido'
          },
          pattern: {
            value: /^[a-zA-Z\s]+$/,
            message: 'El nombre solo puede contener letras y espacios'
          }
        }
      },
      {
        label: 'Telefono',
        placeholder: 'Telefono',
        name: 'telefono',
        type: 'number',
        validations: {
          pattern: {
            value: /^3\d{9}$/,
            message: 'El número debe iniciar con 3 y tener 10 dígitos'
          },
          validate: {
            isInteger: value =>
              Number.isInteger(Number(value)) || 'El número debe ser un entero'
          }
        }
      },
      {
        label: 'Edad',
        placeholder: 'Edad',
        name: 'edad',
        type: 'number',
        validations: {
          min: {
            value: 1,
            message: 'La edad no puede ser menor que 1'
          },
          max: {
            value: 120,
            message: 'La edad no puede ser mayor que 120'
          },
          validate: {
            isInteger: value =>
              Number.isInteger(Number(value)) || 'El número debe ser un entero'
          }
        }
      },
      {
        label: 'Sexo',
        placeholder: 'Sexo',
        name: 'sexo',
        type: 'select',
        options: [
          { id: 'Masculino', name: 'Masculino' },
          { id: 'Femenino', name: 'Femenino' }
        ]
      },
      {
        label: 'Municipio',
        placeholder: 'Municipio de residencia',
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
        label: 'Vivienda',
        placeholder: 'Dirección de residencia',
        name: 'VIVIENDA_id',
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

  const [camposEditables, setCamposEditables] = useState([
    {
      label: 'Telefono',
      placeholder: 'Telefono',
      name: 'telefono',
      type: 'number',
      validations: {
        pattern: {
          value: /^3\d{9}$/,
          message: 'El número debe iniciar con 3 y tener 10 dígitos'
        },
        validate: {
          isInteger: value =>
            Number.isInteger(Number(value)) || 'El número debe ser un entero'
        }
      }
    },
    {
      label: 'Sexo',
      placeholder: 'Sexo',
      name: 'sexo',
      type: 'select',
      options: [
        { id: 'Masculino', name: 'Masculino' },
        { id: 'Femenino', name: 'Femenino' }
      ]
    },
    {
      label: 'Municipio',
      placeholder: 'Municipio de residencia',
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
      label: 'Vivienda',
      placeholder: 'Dirección de residencia',
      name: 'VIVIENDA_id',
      type: 'select',
      options: [],
      validations: {
        required: {
          value: true,
          message: 'Este campo es requerido'
        }
      }
    }
  ])

  const loadMunicipios = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}municipio`)
      const municipiosData = res.data

      const options = municipiosData.map((muni) => ({
        id: muni.id.toString(),
        name: muni.nombre
      }))

      setCampos((prevCampos) =>
        prevCampos.map((campo) =>
          campo.name === 'MUNICIPIO_id'
            ? { ...campo, options }
            : campo
        )
      )
      setCamposEditables((prevCampos) =>
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

  const loadPersonas = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}persona`)
      setPersonas(res.data)
    } catch (error) {
      console.error('Error al obtener personas: ', error)
    }
  }

  const loadVivienda = async (municipioId) => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}vivienda/${municipioId}`)
      const viviendaData = res.data

      const options = viviendaData.map((vivienda) => ({
        id: vivienda.id.toString(),
        name: vivienda.direccion
      }))

      setCampos((prevCampos) =>
        prevCampos.map((campo) =>
          campo.name === 'VIVIENDA_id'
            ? { ...campo, options }
            : campo
        )
      )
      setCamposEditables((prevCampos) =>
        prevCampos.map((campo) =>
          campo.name === 'VIVIENDA_id'
            ? { ...campo, options }
            : campo
        )
      )
    } catch (error) {
      console.error('Error al obtener viviendas: ', error)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      await loadMunicipios()
      await loadPersonas()
      setIsLoading(false)
    }

    fetchData()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      if (municipioSelect) {
        await loadVivienda(municipioSelect)
      }
    }

    fetchData()
  }, [municipioSelect])

  const columns = [
    { label: 'Documento', key: 'id' },
    { label: 'Nombres', key: 'nombre' },
    { label: 'Apellidos', key: 'apellido' },
    { label: 'Telefono', key: 'telefono' },
    { label: 'Edad', key: 'edad' },
    { label: 'Sexo', key: 'sexo' },
    { label: 'Vivienda', key: 'municipio_nombre' },
    { label: 'Municipio', key: 'vivienda_direccion' },
    { label: 'Cabeza de familia', key: 'PERSONA_cabeza_familia_id' },
    { label: 'Editar', key: 'acciones' } // Cambia el nombre aquí si lo prefieres
  ]

  const openEditForm = (persona) => {
    cambiarEstadoForm2(!estadoForm2)
    setPersonaToEdit(persona)
  }

  const openAddForm = () => {
    cambiarEstadoForm1(!estadoForm1)
  }

  const sendEditForm = async (data) => {
    try {
      const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}persona/${data.id}`, data, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      return { type: 'success', message: res.data.message }
    } catch (error) {
      return { type: 'error', message: 'Error al editar la persona' }
    }
  }

  const sendAddForm = async (data) => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}persona`, data, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      return { type: 'success', message: res.data.message }
    } catch (error) {
      return { type: 'error', message: 'Error al registrar la persona' }
    }
  }
  const dataWithActions = personas.map((persona) => ({
    ...persona,
    acciones: (
      <button
        onClick={() => openEditForm(persona)}
        className="p-2 text-blue-500 hover:text-blue-700"
        title="Editar"
      >
        <EditIcon className="w-6 h-6" />
      </button>
    )
  }))

  const filteredData = dataWithActions.filter(persona =>
    persona.apellido.toLowerCase().includes(search.toLowerCase()) ||
    persona.id.toString().includes(search.toLowerCase())
  )

  return (
    <div className='items-center h-screen justify-items-center p-8 pb-20 gap-16 overflow-y-auto'>
      <main className="flex gap-8 justify-center w-full">
        <div className='flex flex-col justify-evenly w-5/6 items-center gap-6'>
          <h1 className='title'>
            Personas
          </h1>
          <div className='flex flex-col gap-4 w-full'>
            <div className="flex items-center gap-4">
              <Input
                type="text"
                placeholder="Busca por número de documento o apellido"
                variant={'bordered'}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button
                onPress={openAddForm}
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
                isLoading={isLoading}
              />
            </div>
            <Formulario
            estado = {estadoForm1}
            cambiarEstado={cambiarEstadoForm1}
            titulo="Registro de Persona"
            campos={campos}
            action={sendAddForm}
            botonTexto="Agregar Persona"
            setSelect={setMunicipioSelect}

            />
            <Formulario
            estado = {estadoForm2}
            cambiarEstado={cambiarEstadoForm2}
            titulo="Editar Persona"
            campos={camposEditables}
            values={personaToEdit}
            action={sendEditForm}
            botonTexto="Editar Persona"
            setSelect={setMunicipioSelect}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
