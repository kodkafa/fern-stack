import {inject, observer} from 'mobx-react'
import React, {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {useTranslation} from 'react-i18next'
import * as Yup from 'yup'
import {Form, Input, Submit} from 'form'
import {Validator} from 'helpers/validations'

export const Reset = inject('AuthStore')(
  observer(props => {
    const {t} = useTranslation()
    const {email} = new Validator()
    const schema = Yup.object().shape({
      email,
    })

    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const location = localStorage.getItem('location')

    const onSubmit = async data => {
      setLoading(true)
      if (await props.AuthStore.reset(data)) {
        navigate(location || '/signin')
      } else setLoading(false)
    }

    const {authenticated} = props.AuthStore
    useEffect(() => {
      if (authenticated) navigate(location || '/dashboard')
    }, [navigate, authenticated, location])

    return (
      <section className="cover min-vh-100 bg-light">
        <div className="container">
          <div className="row h-100 justify-content-md-center">
            <div className="col-sm-4 my-auto">
              <div className="row justify-content-md-center">
                <Form
                  className="card border-0 p-4 shadow"
                  schema={schema}
                  onSubmit={onSubmit}>
                  <h1 className="h4 lined">
                    <span>{t('RESET')}</span>
                  </h1>
                  <Input label={t('Email')} name="email" className="mb-1" />
                  <Submit loading={loading} className="mt-2">
                    {t('Send a reset email')}
                  </Submit>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  })
)
