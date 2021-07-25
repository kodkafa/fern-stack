import {inject, observer} from 'mobx-react'
import React, {useState} from 'react'
import {useTranslation} from 'react-i18next'
import 'react-datepicker/dist/react-datepicker.css'
import * as Yup from 'yup'
import {DateInput, Form, Input, Submit, Textarea} from 'components/form'

export const Account = inject(
  'AuthStore',
  'UserStore'
)(
  observer(props => {
    const {t} = useTranslation()
    const schema = Yup.object().shape({
      last: Yup.string().required(t('Surname is required')),
      first: Yup.string().required(t('Name is required')),
      bio: Yup.string(),
    })

    const {me} = props.AuthStore
    const defaultValues = {
      first: me.first,
      last: me.last,
      born: me.born,
      bio: me.bio,
    }

    const [loading, setLoading] = useState(false)

    const onSubmit = async data => {
      setLoading(true)
      await props.UserStore.updateMe(data)
      setLoading(false)
    }

    return (
      <div className="container">
        <h1 className="h4 lined">
          <span>{t('ACCOUNT')}</span>
        </h1>
        <div className="row  justify-content-md-center">
          <div className="col-6 my-auto">
            <div className="row justify-content-md-center">
              <Form
                className="border-0 p-4 "
                schema={schema}
                defaultValues={defaultValues}
                onSubmit={onSubmit}>
                <div className="row mb-1">
                  <Input label={t('Name')} name="first" className="col" />
                  <Input label={t('Surname')} name="last" className="col" />
                </div>
                <DateInput
                  label={t('Birthday')}
                  name="born"
                  dateFormat="d MMMM yyyy"
                />
                <Textarea label={t('Bio')} name="bio" />
                <Submit loading={loading} className="mt-2">
                  {t('Save')}
                </Submit>
              </Form>
            </div>
          </div>
        </div>
      </div>
    )
  })
)
