import {inject, observer} from 'mobx-react'
import React, {useState} from 'react'
import {useTranslation} from 'react-i18next'
import {Form, Input, Submit} from 'form'
import * as Yup from 'yup'

export const ChangePassword = inject('AuthStore')(
  observer(props => {
    const {t} = useTranslation()
    const schema = Yup.object().shape({
      currentPassword: Yup.string()
        .min(3, 'Password must be 3 characters or longer')
        .required('Password is required'),
      newPassword: Yup.string()
        .min(8, 'Password must be 8 characters or longer')
        .matches(/[a-z]/, 'Password must contain at least one lowercase char')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase char')
        .matches(
          /[a-zA-Z]+[^a-zA-Z\s]+/,
          'at least 1 number or special char (@,!,#, etc).'
        ),
      passwordConfirmation: Yup.string()
        .oneOf([Yup.ref('newPassword'), null], 'Passwords do not match')
        .required('Password is required'),
    })

    const [loading, setLoading] = useState(false)

    const onSubmit = async data => {
      console.log({data})
      setLoading(true)
      await props.AuthStore.changeUserPassword(data)
      setLoading(false)
    }

    return (
      <div className="container">
        <h1 className="h4 lined">
          <span>{t('CHANGE PASSWORD')}</span>
        </h1>
        <div className="row  justify-content-md-center">
          <div className="col-6 my-auto">
            <div className="row justify-content-md-center">
              <Form
                className="border-0 p-4 "
                schema={schema}
                defaultValues={{}}
                onSubmit={onSubmit}>
                <Input
                  label={t('Current Password')}
                  name="currentPassword"
                  className="col"
                  type="password"
                />
                <Input
                  label={t('New Password')}
                  name="newPassword"
                  className="col"
                  type="password"
                />
                <Input
                  label={t('Confirm the New Password')}
                  name="passwordConfirmation"
                  className="col"
                  type="password"
                />

                <Submit loading={loading} className="mt-2">
                  {t('Change my password')}
                </Submit>
              </Form>
            </div>
          </div>
        </div>
      </div>
    )
  })
)
