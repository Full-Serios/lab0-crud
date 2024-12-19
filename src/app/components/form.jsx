import { Input, Button, Select, SelectItem, DatePicker } from '@nextui-org/react'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { getLocalTimeZone, today } from '@internationalized/date'

const Formulario = ({ titulo, campos, botonTexto, estado, cambiarEstado, action, values, setSelect }) => {
  // Hook to manage form data
  const { control, register, handleSubmit, formState: { errors }, reset, setValue } = useForm()
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

    if (cleanedData.fecha_adquisicion && cleanedData.fecha_adquisicion.year && cleanedData.fecha_adquisicion.month && cleanedData.fecha_adquisicion.day) {
      // Convertir el mes y el día en formato de dos dígitos (con 0 si es necesario)
      const month = String(cleanedData.fecha_adquisicion.month).padStart(2, '0')
      const day = String(cleanedData.fecha_adquisicion.day).padStart(2, '0')

      // Crear la fecha en el formato YYYY-MM-DD
      cleanedData.fecha_adquisicion = `${cleanedData.fecha_adquisicion.year}-${month}-${day}`
    }
    console.log(cleanedData)
    const response = await action(cleanedData)
    console.log(response)
    if (response.type === 'error') {
      if (response.code !== 500) {
        toast.error(response.errorResponse, {
          position: 'top-center',
          autoClose: 3000
        })
      } else {
        toast.error(response.message, {
          position: 'top-center',
          autoClose: 3000,
          onClose: () => {
            cambiarEstado(!estado)
            window.location.reload()
          }
        })
        setIsEnable(false)
      }
    } else {
      toast.success(response.message, {
        position: 'top-center',
        autoClose: 3000,
        onClose: () => {
          cambiarEstado(!estado)
          window.location.reload()
        }
      })
      setIsEnable(false)
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
                          isDisabled={campo.isDisabled}
                          isRequired={campo.validations?.required?.value}
                          label={campo.label}
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
                    : campo.type === 'date'
                      ? (
                        <div key={campo.name}>
                          <Controller
                            control={control}
                            name={campo.name}
                            render={({ field }) => (
                              <DatePicker
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
                                onChange={(date) => field.onChange(date)}
                                selected={field.value}
                                maxValue={today(getLocalTimeZone())}
                                isDisabled={campo.isDisabled}
                              />
                            )}
                          />

                      </div>
                        )
                      : (
                      <div key={campo.name}>
                        <Input
                          type={campo.type}
                          clearable
                          isRequired={campo.validations?.required?.value}
                          label={campo.label}
                          placeholder={campo.placeholder}
                          name={campo.name}
                          {...register(campo.name, campo.validations)}
                          isInvalid={errors[campo.name] && true}
                          errorMessage={errors[campo.name]?.message}
                          isDisabled={campo.isDisabled}
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
