import React from 'react'
import {Controller, useFormContext} from 'react-hook-form'
import DatePicker from 'react-datepicker'

export function DateInput({
  name,
  label,
  className,
  placeholder,
  dateFormat = 'd MMMM yyyy',
}) {
  const {
    control,
    formState: {errors},
  } = useFormContext()
  return (
    <fieldset className={className}>
      {label && <label className="small">{label}</label>}
      <Controller
        control={control}
        name={name}
        render={({field: {onChange, value}}) => (
          <DatePicker
            onChange={e => onChange(e)}
            selected={value}
            className="form-control"
            dateFormat={dateFormat}
            placeholder={placeholder}
          />
        )}
      />
      {errors && errors[name] && (
        <small className="form-text text-danger small">
          <span className="small">* {errors[name].message}</span>
        </small>
      )}
    </fieldset>
  )
}
