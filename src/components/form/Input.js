import React from 'react'
import {useFormContext} from 'react-hook-form'

// export const Input = memo(
//     ({ register, formState: { isDirty } }) => (
//         <div>
//             <input {...register("test")} />
//             {isDirty && <p>This field is dirty</p>}
//         </div>
//     ),
//     (prevProps, nextProps) =>
//         prevProps.formState.isDirty === nextProps.formState.isDirty
// );

export function Input({name, label, className, ...rest}) {
  const {
    register,
    formState: {errors},
  } = useFormContext()
  return (
    <fieldset className={className}>
      {label && <label className="small">{label}</label>}
      <input {...register(name)} className="form-control" {...rest} />
      {errors && errors[name] && (
        <small className="form-text text-danger small">
          <span className="small">* {errors[name].message}</span>
        </small>
      )}
    </fieldset>
  )
}
