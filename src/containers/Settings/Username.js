import {inject, observer} from "mobx-react";
import React, {Component} from 'react';
import {Field, Form, Formik} from 'formik'
import * as Yup from 'yup'

let setSubmittingHigher;
const FormikForm = ({
                      values,
                      touched,
                      errors,
                      isSubmitting
                    }) => (
    <Form className="col-md-6">
      <fieldset className="form-group">
        <Field className="form-control" type="text" name="username" placeholder="Username"/>
        {touched.username && errors.username &&
        <small className="form-text text-danger">{errors.username}</small>}
      </fieldset>
      <fieldset className="form-group">
        <Field className="form-control" type="text" name="email" placeholder="email@email.com"/>
        {touched.email && errors.email && <small className="form-text text-danger">{errors.email}</small>}
      </fieldset>
      <div className="row">
        <fieldset className="col-md-6 form-group">
          <label>Name</label>
          <Field className="form-control" type="text" name="name" placeholder="Name"/>
          {touched.name && errors.name && <small className="form-text text-danger">{errors.name}</small>}
        </fieldset>
        <fieldset className="col-md-6 form-group">
          <label>Surname</label>
          <Field className="form-control" type="text" name="surname" placeholder="Surname"/>
          {touched.surname && errors.surname &&
          <small className="form-text text-danger">{errors.surname}</small>}
        </fieldset>
      </div>
      <fieldset className="form-group">
        <Field className="form-control" component="textarea" name="bio"
               placeholder="Write something short about you"/>
        {touched.bio && errors.bio && <small className="form-text text-danger">{errors.bio}</small>}
      </fieldset>
      <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
        {isSubmitting && <span><i className="fa fa-circle-notch fa-spin"/>&nbsp;</span>}
        Update my Account
      </button>
    </Form>
);

@inject('AuthStore', 'UserStore')
@observer
class EnhancedForm extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      username: '',
      first: '',
      last: '',
      born: '',
    }
  }

  handleSubmit = (values, {props, setFieldError, setSubmitting, setStatus}) => {
    setStatus(null);
    console.log({values});
    //await props.AuthStore.userSignUp(values);
    try {
      this.props.UserStore.updateUser(values);
      //setStatus({'success': 'Your account has been created successfully!'})
      setSubmitting(false);
      //resetForm();
    } catch (errors) {
      //setStatus({'error': errors})
      //setSubmitting(false);
    }
  };

  render() {
    return (
      <div className="row justify-content-md-center">
        <Formik component={FormikForm}
                enableReinitialize="true"
                initialValues={{...this.state}}
                validationSchema={Yup.object().shape({
                  // email: Yup.string().email('Please write a correct email address').required('Email is required'),
                  // password: Yup.string().min(8, 'Password must be 8 characters or longer')
                  //   .matches(/[a-z]/, 'Password must contain at least one lowercase char')
                  //   .matches(/[A-Z]/, 'Password must contain at least one uppercase char')
                  //   .matches(/[a-zA-Z]+[^a-zA-Z\s]+/, 'at least 1 number or special char (@,!,#, etc).'),
                  // username: Yup.string().matches(/^[A-Za-z0-9]+(?:[._-][A-Za-z0-9]+)*$/, 'Username only contain english characters and (_,-,.). Also usernames must start and end with a letter or number.')
                  //   .required('Username is required'),
                  //last: Yup.string().required('Surname is required'),
                  //first: Yup.string().required('Name is required'),
                })}
                onSubmit={this.handleSubmit}/>
      </div>)
  }
}

export default EnhancedForm
