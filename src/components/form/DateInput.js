import React from 'react'
import {Controller, useFormContext} from 'react-hook-form'
import DatePicker from 'react-datepicker'

export function DateInput({
  name,
  label,
  className,
  placeholder,
  dateFormat = 'd MMMM yyyy',
  ...rest
}) {
  const {control, errors} = useFormContext()
  return (
    <fieldset className={className}>
      {label && <label className="small">{label}</label>}
      <Controller
        control={control}
        render={({onChange, onBlur, value, dateFormat, ...rest}) => (
          <DatePicker
            {...rest}
            onChange={onChange}
            onBlur={onBlur}
            selected={value}
            className="form-control"
            dateFormat={dateFormat}
          />
        )}
        name={name}
      />
      {errors && errors[name] && (
        <small className="form-text text-danger small">
          <span className="small">* {errors[name].message}</span>
        </small>
      )}
    </fieldset>
  )
}
