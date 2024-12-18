import { Input, Button, Select, SelectItem } from '@nextui-org/react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Formulario = ({ titulo, campos, botonTexto, estado, cambiarEstado, action, values, setSelect }) => {
  // Hook to manage form data
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm()
  const [isEnable, setIsEnable] = useState(true)

  useEffect(() => {
    if (values) {
      reset(values)
    }
  }, [values, reset])

  const onSubmit = handleSubmit(async data => {
    const cleanedData = Object.fromEntries(
      Object.entries(data).map(([key, value]) => {
        return [key, value === '' || value === undefined || value === null ? null : value]
      })
    )

    setIsEnable(false)

    const response = await action(cleanedData)

    if (response.type === 'error') {
      toast.error(response.message, {
        position: 'top-center',
        autoClose: 3000,
        onClose: () => {
          cambiarEstado(!estado)
          window.location.reload()
        }
      })
    } else {
      toast.success(response.message, {
        position: 'top-center',
        autoClose: 3000,
        onClose: () => {
          cambiarEstado(!estado)
          window.location.reload()
        }
      })
    }
  })

  return (
    <>
      {estado &&
        <div className="w-screen h-screen fixed top-0 left-0 bg-slate-300 bg-opacity-40 flex justify-center items-center overflow-y-auto no-scrollbar">
            <div className="min-w-96 w-auto max-h-[90vh] bg-white p-5 overflow-y-auto rounded-lg no-scrollbar">
              <div className="relative">
                <button
                  onClick={() => {
                    cambiarEstado(!estado)
                    reset()
                  }}
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
            <form onSubmit={onSubmit} noValidate>
              <h1 className="subtitle text-center">
                {titulo}
              </h1>
              <div className="flex flex-col gap-4 my-4">
                {campos.map((campo) => (

                  campo.type === 'select'
                    ? (
                      <div key={campo.name}>
                        <Select
                          clearable
                          label={
                            <span>
                              {campo.label}
                              {campo.validations?.required?.value && (
                                <strong className="text-red-500"> *</strong>
                              )}
                            </span>
                          }
                          placeholder={campo.placeholder}
                          name={campo.name}
                          {...register(campo.name, campo.validations)}
                          isInvalid={errors[campo.name] && true}
                          errorMessage={errors[campo.name]?.message}
                          onChange={(e) => {
                            setValue(campo.name, e.target.value)

                            if (campo.name === 'MUNICIPIO_id' && (titulo === 'Registro de Vivienda' || titulo === 'Registro de Persona' || titulo === 'Editar Persona' || titulo === 'Editar Vivienda' || titulo === 'Registro de Vivienda')) setSelect(e.target.value)
                          }}
                        >
                          {campo.options.map(option => (
                            <SelectItem key={option.id} value={option.id} textValue={option.name}>
                            {option.name}
                          </SelectItem>
                          ))}
                        </Select>
                      </div>
                      )
                    : (
                      <div key={campo.name}>
                        <Input
                          type={campo.type}
                          clearable
                          label={
                            <span>
                              {campo.label}
                              {campo.validations?.required?.value && (
                                <strong className="text-red-500"> *</strong>
                              )}
                            </span>
                          }
                          placeholder={campo.placeholder}
                          name={campo.name}
                          {...register(campo.name, campo.validations)}
                          isInvalid={errors[campo.name] && true}
                          errorMessage={errors[campo.name]?.message}
                        />
                      </div>
                      )
                ))}
              </div>
              <div className="flex justify-center">
                <Button
                  type='submit'
                  className="w-auto"
                  color="primary"
                  auto
                  isDisabled={!isEnable}
                >
                  {botonTexto}
                </Button>

              </div>
            </form>
          </div>
        </div>
      }
    </>
  )
}

export default Formulario
