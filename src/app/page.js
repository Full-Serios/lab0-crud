import Image from 'next/image'

export default function Home () {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex gap-8 row-start-2 justify-center">
        <div className='flex w-3/4 gap-10'>
          <div>
            <Image
              src={'/images/home.png'}
              width={800}
              height={800}
              alt="Home"
            />
          </div>
          <div className='flex flex-col justify-evenly'>
            <h1 className='title'>
              Bienvenido a la Plataforma de Gestión Comunitaria
            </h1>
            <p>
              Explora, administra y conecta con tu comunidad. Desde departamentos hasta viviendas, nuestra plataforma te permite gestionar fácilmente la información y mantener la integridad de tus datos. Simplifica tus procesos y colabora de manera eficiente para construir un entorno más organizado y funcional. ¡Comienza ahora!
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
