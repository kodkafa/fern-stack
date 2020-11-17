import {inject, observer} from 'mobx-react'
import React, {useEffect, useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {useTranslation} from 'react-i18next'
import * as Yup from 'yup'
import {Form, Input, Submit} from 'form'
import {Validator} from 'helpers/validations'

export const SignUp = inject('AuthStore')(
  observer(props => {
    const {t} = useTranslation()
    const {email, password} = new Validator()
    const schema = Yup.object().shape({
      email,
      password,
      last: Yup.string().required(t('Surname is required')),
      first: Yup.string().required(t('Name is required')),
    })

    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const location = localStorage.getItem('location')

    const onSubmit = async data => {
      setLoading(true)
      if (await props.AuthStore.createUserWithEmailPassword(data)) {
        navigate(location || '/dashboard')
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
                    <span>{t('SIGN UP')}</span>
                  </h1>
                  <div className="row mb-1">
                    <Input label={t('Name')} name="first" className="col" />
                    <Input label={t('Surname')} name="last" className="col" />
                  </div>
                  <Input label={t('Email')} name="email" className="mb-1" />
                  <Input
                    label={t('Password')}
                    name="password"
                    type="password"
                    className="mb-1"
                  />
                  {/*<Check label={t('Remember me')} name="remember" className={"my-2"}/>*/}
                  <p className="text-muted text-center small mt-2">
                    By creating an account, you agree to our{' '}
                    <Link to="/tos">Terms of Service</Link>&nbsp; and{' '}
                    <Link to="/privacy">Privacy Policy</Link>.
                  </p>
                  <Submit loading={loading}>{t('Create my account')}</Submit>
                  <p className="text-muted text-center small pt-4">
                    You can <Link to="/signin">sign in</Link> if you have an
                    account already.
                  </p>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  })
)
