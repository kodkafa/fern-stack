import {inject, observer} from "mobx-react";
import React, {Component} from 'react';
import {Field, Form, Formik} from 'formik'
import DatePicker from "react-datepicker"
import moment from "moment"
import "react-datepicker/dist/react-datepicker.css";
import * as Yup from 'yup'

let setSubmittingHigher;
const FormikForm = ({
                      values,
                      touched,
                      errors,
                      setFieldValue,
                      isSubmitting
                    }) => (
  <Form className="col-md-6">
    <div className="row">
      <fieldset className="col-md-6 form-group">
        <label>Name</label>
        <Field className="form-control" type="text" name="first" placeholder="Name"/>
        {touched.first && errors.first && <small className="form-text text-danger">{errors.first}</small>}
      </fieldset>
      <fieldset className="col-md-6 form-group">
        <label>Surname</label>
        <Field className="form-control" type="text" name="last" placeholder="Surname"/>
        {touched.last && errors.last &&
        <small className="form-text text-danger">{errors.last}</small>}
      </fieldset>
    </div>
    <fieldset className="form-group">
      <label>Birthday</label>
      {console.log('born', values.born)}
      <DatePicker
        selected={values.born}
        dateFormat="d MMMM yyyy"
        className="form-control"
        name="born"
        onChange={date => setFieldValue('born', date)}
      />
      {touched.born && errors.born && <small className="form-text text-danger">{errors.born}</small>}
    </fieldset>
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
  // constructor(props) {
  //   super(props);
  //   const {first, last, born, bio} = props.AuthStore.me;
  //   this.state = {first, last, born, bio};
  //   console.log('state', this.state, props.AuthStore.me)
  // }

  handleSubmit = (values, {props, setFieldError, setSubmitting, setStatus}) => {
    setStatus(null);
    console.log({values});
    //await props.AuthStore.userSignUp(values);
    try {
      this.props.UserStore.updateMe(values);
      //setStatus({'success': 'Your account has been created successfully!'})
      setSubmitting(false);
      //resetForm();
    } catch (errors) {
      //setStatus({'error': errors})
      //setSubmitting(false);
    }
  };

  render() {
    const me = this.props.AuthStore.me;
    return (
      <div className="row justify-content-md-center">
        <Formik component={FormikForm}
                enableReinitialize="true"
                initialValues={me}
                validationSchema={Yup.object().shape({
                  // email: Yup.string().email('Please write a correct email address').required('Email is required'),
                  // password: Yup.string().min(8, 'Password must be 8 characters or longer')
                  //   .matches(/[a-z]/, 'Password must contain at least one lowercase char')
                  //   .matches(/[A-Z]/, 'Password must contain at least one uppercase char')
                  //   .matches(/[a-zA-Z]+[^a-zA-Z\s]+/, 'at least 1 number or special char (@,!,#, etc).'),
                  // username: Yup.string().matches(/^[A-Za-z0-9]+(?:[._-][A-Za-z0-9]+)*$/, 'Username only contain english characters and (_,-,.). Also usernames must start and end with a letter or number.')
                  //   .required('Username is required'),
                  first: Yup.string().required('Name is required'),
                  last: Yup.string().required('Surname is required'),
                })}
                onSubmit={this.handleSubmit}/>
      </div>)
  }
}

export default EnhancedForm
