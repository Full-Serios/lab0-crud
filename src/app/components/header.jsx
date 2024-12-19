'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Header () {
  const pathname = usePathname()

  const isActive = (path) => pathname === path

  return (
    <header className='bg-white shadow-lg rounded-lg mx-4 mt-4 mb-4'>
      <nav className='py-4 px-6 text-white flex justify-center rounded-lg'>
        <ul className='flex justify-evenly text-gray-primary w-5/6'>
          <Link
            className={`hover:font-bold ${isActive('/') ? 'font-bold text-blue-900' : ''}`}
            href="/"
          >
            Home
          </Link>
          <Link
            className={`hover:font-bold ${isActive('/departamentos') ? 'font-bold text-blue-900' : ''}`}
            href="/departamentos"
          >
            Departamentos
          </Link>
          <Link
            className={`hover:font-bold ${isActive('/municipios') ? 'font-bold text-blue-900' : ''}`}
            href="/municipios"
          >
            Municipios
            </Link>
          <Link
            className={`hover:font-bold ${isActive('/barrios') ? 'font-bold text-blue-900' : ''}`}
            href="/barrios"
          >
            Barrios
            </Link>
          <Link
            className={`hover:font-bold ${isActive('/viviendas') ? 'font-bold text-blue-900' : ''}`}
            href="/viviendas"
          >
            Viviendas
            </Link>
          <Link
            className={`hover:font-bold ${isActive('/personas') ? 'font-bold text-blue-900' : ''}`}
            href="/personas"
          >
            Personas
            </Link>
          <Link
            className={`hover:font-bold ${isActive('/propietarios') ? 'font-bold text-blue-900' : ''}`}
            href="/propietarios"
          >
            Propietarios
            </Link>
        </ul>
      </nav>
    </header>
  )
}
