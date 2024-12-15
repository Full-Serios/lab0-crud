import Link from 'next/link'

export default function Header () {
  return (
    <header>
      <nav className='py-5 text-white flex justify-center'>
        <ul className='flex justify-evenly text-gray-primary w-5/6'>
          <Link className='hover:font-bold' href="/">Home</Link>
          <Link className='hover:font-bold' href="/departamentos">Departamentos</Link>
          <Link className='hover:font-bold' href="/municipios">Municipios</Link>
          <Link className='hover:font-bold' href="/barrios">Barrios</Link>
          <Link className='hover:font-bold' href="/viviendas">Viviendas</Link>
          <Link className='hover:font-bold' href="/personas">Personas</Link>
        </ul>
      </nav>
    </header>
  )
}
