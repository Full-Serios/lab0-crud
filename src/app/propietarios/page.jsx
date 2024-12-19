'use client'

import { Input, Button } from '@nextui-org/react'
import TableContent from '../components/table'
import { useEffect, useState } from 'react'
import EditIcon from '../components/EditIcon'
import Formulario from '../components/form'
import axios from 'axios'
import DeleteIcon from '../components/DeleteIcon'

export default function Personas () {
  const [search, setSearch] = useState('')
  const [estadoForm1, cambiarEstadoForm1] = useState(false)// Form para añadir
  const [estadoForm2, cambiarEstadoForm2] = useState(false)// Form para editar

  const [personaToEdit, setPersonaToEdit] = useState(null)
  const [propietarios, setPropietarios] = useState([])

  const [isLoading, setIsLoading] = useState(true)

  const [municipioSelect, setMunicipioSelect] = useState(0)
  const [campos, setCampos] = useState(
    [
      {
        label: 'Documento Identidad',
        placeholder: 'Número de documento del propietario',
        name: 'PERSONA_id',
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
        label: 'Municipio',
        placeholder: 'Municipio',
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
        placeholder: 'Dirección de la vivienda',
        name: 'VIVIENDA_id',
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
        label: 'Fecha adquisición',
        placeholder: 'Fecha de adquisición de la vivienda',
        name: 'fecha_adquisicion',
        type: 'date'
      }
    ]
  )

  const [camposEditables, setCamposEditables] = useState([
    {
      label: 'Documento Identidad',
      placeholder: 'Número de documento del propietario',
      name: 'PERSONA_id',
      type: 'text',
      options: [],
      validations: {
        required: {
          value: true,
          message: 'Este campo es requerido'
        }
      },
      isDisabled: true
    },
    {
      label: 'Vivienda',
      placeholder: 'Dirección de la vivienda',
      name: 'VIVIENDA_id',
      type: 'text',
      options: [],
      validations: {
        required: {
          value: true,
          message: 'Este campo es requerido'
        }
      },
      isDisabled: true
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

  const loadDocumentos = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}persona`)
      const personasData = res.data

      const options = personasData.map((persona) => ({
        id: persona.id.toString(),
        name: persona.id
      }))

      setCampos((prevCampos) =>
        prevCampos.map((campo) =>
          campo.name === 'PERSONA_id'
            ? { ...campo, options }
            : campo
        )
      )
    } catch (error) {
      console.error('Error al obtener personas: ', error)
    }
  }

  const loadPropietarios = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}personaVivienda`)
      setPropietarios(res.data)
    } catch (error) {
      console.error('Error al obtener propietarios: ', error)
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
      await loadPropietarios()
      await loadDocumentos()
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
    { label: 'Documento', key: 'PERSONA_id' },
    { label: 'Nombres', key: 'nombre_persona' },
    { label: 'Apellidos', key: 'apellido_persona' },
    { label: 'Vivienda', key: 'direccion_vivienda' },
    { label: 'Fecha de adquisición', key: 'fecha_adquisicion' },
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
      const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}personaVivienda/${data.PERSONA_id}/${data.VIVIENDA_id}`)
      return { type: 'success', message: res.data.message }
    } catch (error) {
      return { type: 'error', message: 'Error al borrar la persona', code: error.response.status, errorResponse: error.response.data.message }
    }
  }

  const sendAddForm = async (data) => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}personaVivienda`, data, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      return { type: 'success', message: res.data.message }
    } catch (error) {
      console.error('Error al registrar la persona:', error)
      return { type: 'error', message: 'Error al registrar la persona', code: error.response.status, errorResponse: error.response.data.message }
    }
  }
  const dataWithActions = propietarios.map((persona) => ({
    ...persona,
    acciones: (
      <button
        onClick={() => {
          openEditForm(persona)
          console.log(persona)
        }
}
        className="p-2 text-blue-500 hover:text-blue-700"
        title="Eliminar"
      >
        <DeleteIcon className="w-6 h-6" />
      </button>
    )
  }))

  const filteredData = dataWithActions.filter(persona =>
    persona.apellido_persona.toLowerCase().includes(search.toLowerCase()) ||
    persona.PERSONA_id.toString().includes(search.toLowerCase())
  )

  return (
    <div className='items-center h-screen justify-items-center p-8 pb-20 gap-16 overflow-y-auto'>
      <main className="flex gap-8 justify-center w-full">
        <div className='flex flex-col justify-evenly w-5/6 items-center gap-6'>
          <h1 className='title'>
            Propietarios de viviendas
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
                Añadir Propietario
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
            titulo="Registro de Propietario"
            campos={campos}
            action={sendAddForm}
            botonTexto="Agregar Propietario"
            setSelect={setMunicipioSelect}

            />
            <Formulario
            estado = {estadoForm2}
            cambiarEstado={cambiarEstadoForm2}
            titulo="¿Desea eliminar este registro?"
            campos={camposEditables}
            values={personaToEdit}
            action={sendEditForm}
            botonTexto="Eliminar"
            setSelect={setMunicipioSelect}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
