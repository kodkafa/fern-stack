import {inject, observer} from 'mobx-react'
import React, {useEffect} from 'react'
import {useTranslation} from 'react-i18next'
import {useLocation, useParams} from 'react-router-dom'
import qs from 'qs'
import {DateInput, Form, Input, Submit, Textarea} from 'components/form'
import * as Yup from 'yup'
import {SlideOver} from 'components'
// import {User} from "rest/models";

export const Edit = inject(
  'AuthStore',
  'ProjectStore'
)(
  observer(props => {
    const {t} = useTranslation()
    const schema = Yup.object().shape({
      // username: Yup.string().required('Username is required'),
      // email: Yup.string().email('Please write a correct email address').required('Email is required'),
      // first: Yup.string().required('Name is required'),
      // last: Yup.string().required('Surname is required'),
      // born: Yup.date()
      //   .required('Birthday is required')
      //   .test(
      //     'Birthday',
      //     'Birthday should be greater than 18',
      //     value => moment().diff(moment(value), 'years') >= 18
      //   ),
      // bio: Yup.string()
      //   .min(10, 'Short bio  more than 10 characters or longer')
      //   .max(200, 'Short bio must be under 200 characters or shorter'),
    })

    const location = useLocation()
    const params = {...useParams(), ...qs.parse(location.search)} // !IMPORTANT for deps
    const {id} = params

    const {item = {}, read, update} = props.ProjectStore

    useEffect(() => {
      read({id}).then()
    }, [id, read])

    const onSubmit = async data => await update({id, ...data})

    return (
      <SlideOver title={item.name} className="w-50">
        <Form
          className="border-0 p-4 "
          schema={schema}
          onSubmit={onSubmit}
          defaultValues={item}>
          <div className="row mb-1">
            <Input label={t('Name')} name="name" className="col" />
            <Input label={t('Domains')} name="domains[0]" className="col" />
          </div>
          {/*<DateInput label={t('Created At')} name="createdAt" />*/}
          <Textarea label={t('Description')} name="description" />
          <Submit className="mt-2">{t('Update')}</Submit>
        </Form>
      </SlideOver>
    )
  })
)
