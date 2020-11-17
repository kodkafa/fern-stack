import React from 'react'

export function Check({register, name, label, className, ...rest}) {
  return (
    <fieldset className={'form-check ' + className}>
      <label className="form-check-label">
        <input
          name={name}
          className="form-check-input"
          ref={register}
          {...rest}
          type="checkbox"
        />
        {label}
      </label>
    </fieldset>
  )
}
