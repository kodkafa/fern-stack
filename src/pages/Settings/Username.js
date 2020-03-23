import {inject, observer} from "mobx-react";
import React, {Component} from 'react';
import {Field, Form, Formik} from 'formik'
import * as Yup from 'yup'

const FormikForm = ({
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
    <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
      {isSubmitting && <span><i className="fa fa-circle-notch fa-spin"/>&nbsp;</span>}
      Claim the username
    </button>
  </Form>
);

@inject('AuthStore', 'UserStore')
@observer
class EnhancedForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: props.AuthStore.me.username,
    }
  }

  handleSubmit = (values, {props, setFieldError, setSubmitting, setStatus}) => {
    setStatus(null);
    console.log(values, values.username);
    //await props.AuthStore.userSignUp(values);
    try {
      this.props.AuthStore.me.changeUsername(values.username)
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
                initialValues={{username: this.props.AuthStore.me.username}}
                validationSchema={Yup.object().shape({
                  // email: Yup.string().email('Please write a correct email address').required('Email is required'),
                  // password: Yup.string().min(8, 'Password must be 8 characters or longer')
                  //   .matches(/[a-z]/, 'Password must contain at least one lowercase char')
                  //   .matches(/[A-Z]/, 'Password must contain at least one uppercase char')
                  //   .matches(/[a-zA-Z]+[^a-zA-Z\s]+/, 'at least 1 number or special char (@,!,#, etc).'),
                  username: Yup.string().min(5).max(22).matches(/^[A-Za-z0-9]+(?:[._-][A-Za-z0-9]+)*$/, 'Username only contain english characters and (_,-,.). Also usernames must start and end with a letter or number.')
                  //   .required('Username is required'),
                  //last: Yup.string().required('Surname is required'),
                  //first: Yup.string().required('Name is required'),
                })}
                onSubmit={this.handleSubmit}/>
      </div>)
  }
}

export default EnhancedForm
