import {inject, observer} from 'mobx-react'
import React, {useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {useLocation, useParams} from 'react-router-dom'
import moment from 'moment'
import qs from 'qs'
import {
  DateInput,
  Form,
  Input,
  Submit,
  Textarea,
  ToggleButton,
} from 'components/form'
import * as Yup from 'yup'
// import {User} from "rest/models";

export const Edit = inject(
  'AuthStore',
  'UserStore'
)(
  observer(props => {
    const {t} = useTranslation()
    const schema = Yup.object().shape({
      // username: Yup.string().required('Username is required'),
      // email: Yup.string().email('Please write a correct email address').required('Email is required'),
      first: Yup.string().required('Name is required'),
      last: Yup.string().required('Surname is required'),
      born: Yup.date()
        .required('Birthday is required')
        .test(
          'Birthday',
          'Birthday should be greater than 18',
          value => moment().diff(moment(value), 'years') >= 18
        ),
      bio: Yup.string()
        .min(10, 'Short bio  more than 10 characters or longer')
        .max(200, 'Short bio must be under 200 characters or shorter'),
    })
    const [loading, setLoading] = useState(false)

    const location = useLocation()
    const params = {...useParams(), ...qs.parse(location.search)} // !IMPORTANT for deps
    const {id} = params

    const {_list, getUserById, updateUserById, toggleClaimById} =
      props.UserStore
    useEffect(() => {
      getUserById(id).then()
    }, [id, getUserById])

    const item = _list.get(id) || {}
    console.log({_list})

    const onSubmit = async data => {
      setLoading(true)
      await updateUserById({id, ...data})
      setLoading(false)
    }

    const toggleClaim = async e => {
      const el = e.currentTarget
      const position = el.dataset.position
      const defaultClass = el.getElementsByTagName('i')[0].className
      el.disabled = true
      el.getElementsByTagName('i')[0].className = 'fa fa-circle-notch fa-spin'
      try {
        await toggleClaimById({id, position})
        el.disabled = false
        el.getElementsByTagName('i')[0].className = defaultClass
      } catch (error) {
        console.log('error', error)
        el.disabled = false
        el.getElementsByTagName('i')[0].className = defaultClass
      }
    }

    return (
      <section className="container">
        {!item.id ? (
          <div className="row justify-content-md-center">
            <i className="fa fa-circle-notch fa-spin fa-3x" />
          </div>
        ) : (
          <div className="row justify-content-md-center">
            <div className="col-md-6">
              <Form
                className="border-0 p-4 "
                schema={schema}
                defaultValues={{born: new Date(item.born), ...item}}
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
                  {t('Update the Account')}
                </Submit>
              </Form>
              <div className="mt-5">
                <h5>Access Control</h5>
                <div className="d-flex justify-content-center p-3 border">
                  <ToggleButton
                    icon="fa fa-user-astronaut"
                    data-position="admin"
                    status={item.isAdmin}
                    className="btn"
                    classActive="btn-success"
                    classPassive="border"
                    toggleFunction={toggleClaim}>
                    Admin
                  </ToggleButton>

                  <ToggleButton
                    icon="fa fa-user-graduate"
                    data-position="editor"
                    status={item.isEditor}
                    className="btn ms-1"
                    classActive="btn-success"
                    classPassive="border"
                    toggleFunction={toggleClaim}>
                    Editor
                  </ToggleButton>

                  <ToggleButton
                    icon="fa fa-user-secret"
                    data-position="manager"
                    status={item.isManager}
                    className="btn ms-1"
                    classActive="btn-success"
                    classPassive="border"
                    toggleFunction={toggleClaim}>
                    Manager
                  </ToggleButton>

                  <ToggleButton
                    icon="fa fa-user-tie"
                    data-position="worker"
                    status={item.isWorker}
                    className="btn ms-1"
                    classActive="btn-success"
                    classPassive="border"
                    toggleFunction={toggleClaim}>
                    Worker
                  </ToggleButton>

                  <ToggleButton
                    icon="fa fa-user-check"
                    data-position="user"
                    status={item.isUser}
                    className="btn ms-1"
                    classActive="btn-success"
                    classPassive="border"
                    toggleFunction={toggleClaim}>
                    User
                  </ToggleButton>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    )
  })
)
