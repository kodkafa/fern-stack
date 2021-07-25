import {inject, observer} from 'mobx-react'
import React, {useState} from 'react'
import {useTranslation} from 'react-i18next'
import * as Yup from 'yup'
import {Form, Input, Submit} from 'components/form'

export const Username = inject('AuthStore')(
  observer(props => {
    const {t} = useTranslation()
    const schema = Yup.object().shape({
      username: Yup.string().required(t('Username is required')),
    })
    const {me} = props.AuthStore

    const defaultValues = {
      username: me.username,
    }

    const [loading, setLoading] = useState(false)

    const onSubmit = async data => {
      setLoading(true)
      await props.AuthStore.me.changeUsername(data)
      setLoading(false)
    }

    return (
      <div className="container">
        <h1 className="h4 lined">
          <span>{t('SET USERNAME')}</span>
        </h1>
        <div className="row  justify-content-md-center">
          <div className="col-6 my-auto">
            <div className="row justify-content-md-center">
              <Form
                className="border-0 p-4 "
                schema={schema}
                defaultValues={defaultValues}
                onSubmit={onSubmit}>
                <Input label={t('Username')} name="username" className="col" />

                <Submit loading={loading} className="mt-2">
                  {t('Claim')}
                </Submit>
              </Form>
            </div>
          </div>
        </div>
      </div>
    )
  })
)
