import {autorun} from "mobx";
import {inject, observer} from "mobx-react";
import React, {useState} from 'react';
import {useForm} from 'react-hook-form'
import * as Yup from 'yup'
import {useLocation, useParams} from "react-router-dom";
import moment from 'moment'
import qs from "query-string";

import {Input, Submit, TextArea, DatePicker, ToggleButton} from "../../components";

export const Edit = inject(
  'AuthStore',
  'UserStore'
)(observer((props) => {

  const schema = Yup.object().shape({
    // username: Yup.string().required('Username is required'),
    // email: Yup.string().email('Please write a correct email address').required('Email is required'),
    first: Yup.string().required('Name is required'),
    last: Yup.string().required('Surname is required'),
    born: Yup.date().required('Birthday is required')
      .test('Birthday', 'Birthday should be greater than 18',
        (value) => moment().diff(moment(value), 'years') >= 18),
    bio: Yup.string()
      .min(10, 'Short bio  more than 10 characters or longer')
      .max(200, 'Short bio must be under 200 characters or shorter')
  })
  const {control, register, handleSubmit, errors, clearError, setError} = useForm({
    validationSchema: schema
  });
  const [loading, setLoading] = useState(false);

  const location = useLocation()
  const params = {...useParams(), ...qs.parse(location.search)} // !IMPORTANT for deps
  const {id} = params

  autorun(() => {
    props.UserStore.getUserById(id);
  });

  const item = props.UserStore.list.get(id)
  //console.log(item.born, new Date())

  const onSubmit = async (data) => {
    clearError();
    setLoading(true)
    try {
      console.log({data})
      props.UserStore.updateUserById({id, ...data});
      //setStatus({'success': 'Your account has been updated successfully!'});
    } catch (errors) {
      console.log(errors)
      setError(errors);
    }
    setTimeout(() => setLoading(false), 500)
  }

  const toggleClaim = async (e) => {
    const el = e.currentTarget;
    const position = el.dataset.position;
    const defaultClass = el.getElementsByTagName('i')[0].className;
    el.disabled = true;
    el.getElementsByTagName('i')[0].className = 'fa fa-circle-notch fa-spin';
    try {
      await item.toggleClaim(position);
      el.disabled = false;
      el.getElementsByTagName('i')[0].className = defaultClass
    } catch (error) {
      console.log('error', error);
      el.disabled = false;
      el.getElementsByTagName('i')[0].className = defaultClass
    }
  };

  return (
    <section className="container">
      {item === undefined
        ? <div className="row justify-content-md-center"><i className="fa fa-circle-notch fa-spin fa-3x"/></div>
        : <div className="row justify-content-md-center">
          <div className="col-md-6">
            <form className="vertical between stretch" onSubmit={handleSubmit(onSubmit)}>
              <div className="row">
                <Input className="col-md-6"
                       label="Name"
                       name="first"
                       placeholder="first name"
                       defaultValue={item.first}
                       ref={register({required: true})}
                       errors={errors}/>
                <Input className="col-md-6"
                       label="Surname"
                       name="last"
                       placeholder="last name"
                       defaultValue={item.first}
                       ref={register({required: true})}
                       errors={errors}/>
              </div>
              <DatePicker className=""
                          label="Birthday"
                          name="born"
                          defaultValue={item.born || new Date()}
                          startDate={new Date('1900-01-01')}
                          endDate={new Date('2002-01-01')}
                          dateFormat="d MMMM yyyy"
                          register={register({required: true})}
                          errors={errors}
                          control={control}/>
              <TextArea className=""
                        label="Bio"
                        name="bio"
                        placeholder="Write something short about you ..."
                        defaultValue={item.bio}
                        ref={register({})}
                        errors={errors}/>
              {/*<input type="hidden" name="id" value={item.id}/>*/}
              <Submit className=""
                      name="Update the Account"
                      loading={loading}/>
            </form>

            <div className="mt-5">
              <h5>Access Control</h5>
              <div className="d-flex justify-content-center p-3 border">
                <ToggleButton icon="fa fa-user-astronaut"
                              data-position="admin"
                              status={item.isAdmin}
                              className="btn"
                              classActive="btn-success"
                              classPassive="border"
                              toggleFunction={toggleClaim}>Admin</ToggleButton>

                <ToggleButton icon="fa fa-user-graduate"
                              data-position="editor"
                              status={item.isEditor}
                              className="btn ml-1"
                              classActive="btn-success"
                              classPassive="border"
                              toggleFunction={toggleClaim}>Editor</ToggleButton>

                <ToggleButton icon="fa fa-user-secret"
                              data-position="manager"
                              status={item.isManager}
                              className="btn ml-1"
                              classActive="btn-success"
                              classPassive="border"
                              toggleFunction={toggleClaim}>Manager</ToggleButton>

                <ToggleButton icon="fa fa-user-tie"
                              data-position="worker"
                              status={item.isWorker}
                              className="btn ml-1"
                              classActive="btn-success"
                              classPassive="border"
                              toggleFunction={toggleClaim}>Worker</ToggleButton>


                <ToggleButton icon="fa fa-user-check"
                              data-position="user"
                              status={item.isUser}
                              className="btn ml-1"
                              classActive="btn-success"
                              classPassive="border"
                              toggleFunction={toggleClaim}>User</ToggleButton>
              </div>
            </div>
          </div>
        </div>
      }
    </section>
  )
}));
