import {inject, observer} from 'mobx-react'
import React, {useState} from 'react'
import {useTranslation} from 'react-i18next'
import {DateInput, Form, Input, Submit, Textarea} from 'components/form'
import * as Yup from 'yup'

export const Add = inject(
  'AuthStore',
  'PostStore'
)(
  observer(props => {
    const {t} = useTranslation()
    const schema = Yup.object().shape({
      // username: Yup.string().required('Username is required'),
      // email: Yup.string().email('Please write a correct email address').required('Email is required'),
      // first: Yup.string().required('Name is required'),
      // last: Yup.string().required('Surname is required'),
      // born: Yup.date()
      //     .required('Birthday is required')
      //     .test(
      //         'Birthday',
      //         'Birthday should be greater than 18',
      //         value => moment().diff(moment(value), 'years') >= 18
      //     ),
      // bio: Yup.string()
      //     .min(10, 'Short bio  more than 10 characters or longer')
      //     .max(200, 'Short bio must be under 200 characters or shorter'),
    })
    const [loading, setLoading] = useState(false)

    const {create} = props.PostStore

    const onSubmit = async data => {
      setLoading(true)
      await create({data})
      setLoading(false)
    }

    return (
      <section className="container">
        <div className="row justify-content-md-center">
          <div className="col-md-6">
            <Form className="border-0 p-4 " schema={schema} onSubmit={onSubmit}>
              <div className="row mb-1">
                <Input label={t('Title')} name="title" className="col" />
                <Input label={t('Slug')} name="slug" className="col" />
              </div>
              <DateInput label={t('Created At')} name="createdAt" />
              <Textarea label={t('Content')} name="content" />
              <Submit loading={loading} className="mt-2">
                {t('Create')}
              </Submit>
            </Form>
          </div>
        </div>
      </section>
    )
  })
)
