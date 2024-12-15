'use client'

import { Input } from '@nextui-org/react'
import TableContent from '../components/table'
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function Departamentos () {
  const [search, setSearch] = useState('')
  const [departamentos, setDepartamentos] = useState([])

  useEffect(() => {
    const loadDepartamentos = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/departamento')
        console.log(res.data)
        setDepartamentos(res.data)
      } catch (error) {
        console.error('Error al obtener departamentos:', error)
      }
    }

    loadDepartamentos()
  }, [])

  const columns = [
    { label: 'Nombre', key: 'nombre' },
    { label: 'Capital', key: 'municipio_capital_id' }
  ]

  const filteredData = departamentos.filter(departamento =>
    departamento.nombre.toLowerCase().includes(search.toLowerCase()) ||
    departamento.municipio_capital_id.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className='items-center h-screen justify-items-center p-8 pb-20 gap-16 '>
      <main className="flex gap-8 justify-center w-full">
        <div className='flex flex-col justify-evenly w-1/2 items-center gap-6'>
          <h1 className='title'>
            Departamentos
          </h1>
          <div className='flex flex-col gap-4 w-full'>
            <Input
              type="text"
              placeholder="Filtra por departamento o capital"
              variant={'bordered'}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div >
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
