import {inject, observer} from 'mobx-react'
import React, {useEffect, useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {useTranslation} from 'react-i18next'
import * as Yup from 'yup'
import {Form, Input, Submit} from 'form'
import {Validator} from 'helpers/validations'

export const SignIn = inject('AuthStore')(
  observer(props => {
    const {t} = useTranslation()
    const {email, password} = new Validator()
    const schema = Yup.object().shape({
      email,
      password,
    })

    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const location = localStorage.getItem('location')

    const onSubmit = async data => {
      setLoading(true)
      if (await props.AuthStore.signIn(data)) {
        navigate(location || '/dashboard')
      } else setLoading(false)
    }

    const {authenticated} = props.AuthStore
    console.log({authenticated})
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
                    <span>{t('SIGN IN')}</span>
                  </h1>
                  <Input label={t('Email')} name="email" className="mb-1" />
                  <Input
                    label={t('Password')}
                    name="password"
                    type="password"
                    className="mb-1"
                  />
                  {/*<Check label={t('Remember me')} name="remember" className={"my-2"}/>*/}
                  <Submit loading={loading} className="mt-2">
                    {t('Sign In')}
                  </Submit>
                  <p className="text-muted text-center small pt-4">
                    You can <Link to="/signup">sign up</Link> easily if you
                    don't have an account yet. Or you have an issue about sign
                    in you can reset your password <Link to="/reset">here</Link>
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
