'use client'

import { Input } from '@nextui-org/react'
import TableContent from '../components/table'
import { useState } from 'react'

export default function Departamentos () {
  const [search, setSearch] = useState('')

  const columns = [
    { label: 'Nombre', key: 'nombre' },
    { label: 'Capital', key: 'capital' }
  ]

  const data = [
    {
      id: 1,
      nombre: 'Boyaca',
      capital: 'Tunja'
    },
    {
      id: 2,
      nombre: 'Santander',
      capital: 'Bucaramanga'
    },
    {
      id: 3,
      nombre: 'Pasto',
      capital: 'Nariño'
    },
    {
      id: 4,
      nombre: 'Antioquia',
      capital: 'Medellin'
    },
    {
      id: 5,
      nombre: 'Cauca',
      capital: 'Popayan'
    }
  ]

  const filteredData = data.filter(departamento =>
    departamento.nombre.toLowerCase().includes(search.toLowerCase()) ||
    departamento.capital.toLowerCase().includes(search.toLowerCase())
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
