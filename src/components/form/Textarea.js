import React from 'react'
import {useFormContext} from 'react-hook-form'

export function Textarea({name, label, className, ...rest}) {
  const {
    register,
    formState: {errors},
  } = useFormContext()
  console.log({errors})
  return (
    <fieldset className={className}>
      {label && <label className="small">{label}</label>}
      <textarea {...register(name)} className="form-control" {...rest} />
      {errors && errors[name] && (
        <small className="form-text text-danger small">
          <span className="small">* {errors[name].message}</span>
        </small>
      )}
    </fieldset>
  )
}
