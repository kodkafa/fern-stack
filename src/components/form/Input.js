import React from 'react'
import {useFormContext} from 'react-hook-form'

export function Input({name, label, className, ...rest}) {
  const {register, errors} = useFormContext()
  return (
    <fieldset className={className}>
      {label && <label className="small">{label}</label>}
      <input name={name} className="form-control" ref={register} {...rest} />
      {errors && errors[name] && (
        <small className="form-text text-danger small">
          <span className="small">* {errors[name].message}</span>
        </small>
      )}
    </fieldset>
  )
}
