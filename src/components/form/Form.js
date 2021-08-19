import React, {useEffect} from 'react'
import {FormProvider, useForm, useFormContext} from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers/yup'

export function Form({
  className,
  defaultValues,
  children,
  schema,
  onSubmit = data => console.log('onSubmit', data),
  onChange,
}) {
  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues,
    reValidateMode: 'all',
  })
  const {reset} = methods
  useEffect(() => {
    // console.log({defaultValues}, (defaultValues || {}).name)
    reset(defaultValues)
  }, [reset, defaultValues])

  // console.log({defaultValues})
  // const watch = {...methods.watch()}
  // useMemo(() => {
  //   if (onChange) onChange(watch)
  // }, [watch, onChange])
  return (
    <FormProvider {...methods} defaultValues={defaultValues}>
      <form className={className} onSubmit={methods.handleSubmit(onSubmit)}>
        {children}
        {/*<ResetController defaultValues={defaultValues} />*/}
      </form>
    </FormProvider>
  )
}
//
// function ResetController({defaultValues}) {
//   const {reset} = useFormContext() // retrieve all hook methods
//   useEffect(() => {
//     console.log({defaultValues}, (defaultValues || {}).name)
//     reset( {...defaultValues})
//   }, [reset, defaultValues])
//   return <></>
// }

// export function Form(props) {
//   const {i18n} = useTranslation();
//   return <CustomForm key={'form-' + i18n.language} {...props} />
// }
