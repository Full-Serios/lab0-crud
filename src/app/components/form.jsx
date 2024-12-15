import React, { useState } from 'react'
import { Input, Button } from '@nextui-org/react'

const Formulario = ({ titulo, campos, onSubmit, botonTexto, estado, cambiarEstado }) => {
  const [formData, setFormData] = useState(() =>
    campos.reduce((acc, campo) => ({ ...acc, [campo.name]: '' }), {})
  )

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = () => {
    onSubmit(formData)
  }

  return (

    <>
        {estado &&
            <div className="w-screen h-screen fixed top-0 left-0 bg-slate-300 bg-opacity-40 flex justify-center items-center">
                <div className="min-w-96 w-auto h-auto bg-white p-5">
                    <div className="relative">
                        <button
                            onClick={() => cambiarEstado(!estado)}
                            className="top-2 left-2 p-1 hover:bg-gray-200 rounded">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-6 h-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18 18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                    <h1 className="subtitle text-center">
                            {titulo}
                    </h1>
                    <div className="flex flex-col gap-4 my-4">
                        {campos.map((campo) => (
                            <Input
                                key={campo.name}
                                clearable
                                label={campo.label}
                                placeholder={campo.placeholder}
                                name={campo.name}
                                value={formData[campo.name]}
                                onChange={handleInputChange}
                            />
                        ))}
                    </div>
                    <div className="flex justify-center">
                        <Button
                            onClick={handleSubmit}
                            className="w-auto"
                            color="primary"
                            auto
                        >
                            {botonTexto}
                        </Button>
                    </div>
                </div>
            </div>
        }
    </>
  )
}

export default Formulario
