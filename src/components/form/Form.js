import React from 'react'
import {useForm, FormProvider} from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers'

export function Form({
  className,
  defaultValues,
  children,
  schema,
  onSubmit,
  onChange,
}) {
  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues,
    reValidateMode: 'all',
  })
  // const watch = {...methods.watch()}
  // useMemo(() => {
  //   if (onChange) onChange(watch)
  // }, [watch, onChange])

  return (
    <FormProvider {...methods} defaultValues={defaultValues}>
      <form
        className={className}
        onSubmit={methods.handleSubmit(onSubmit || (() => {}))}>
        {children}
      </form>
    </FormProvider>
  )
}

// export function Form(props) {
//   const {i18n} = useTranslation();
//   return <CustomForm key={'form-' + i18n.language} {...props} />
// }
