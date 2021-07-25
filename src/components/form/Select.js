import React from 'react'

export function Select({register, options, name, ...rest}) {
  return (
    <select {...register(name)} {...rest}>
      {options.map(value => (
        <option key={value} value={value}>
          {value}
        </option>
      ))}
    </select>
  )
}
