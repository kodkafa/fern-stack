import {inject, observer} from "mobx-react";
import React, {Component} from 'react';
import {Link, Redirect} from 'react-router-dom';
import {Field, Form, Formik} from 'formik'
import * as Yup from 'yup'

const FormikForm = ({
                      touched,
                      errors,
                      status,
                      isSubmitting
                    }) => (
  <Form className="card border-0 p-4 shadow">
    <h1 className="h4 lined"><span>SIGN UP</span></h1>
    <fieldset className="form-group">
      <label className="small">Email</label>
      <Field className="form-control" type="text" name="email" placeholder="email@email.com"/>
      {touched.email && errors.email &&
      <small className="form-text text-danger">{errors.email}</small>}
    </fieldset>
    <div className="row">
      <fieldset className="col-md-6 form-group">
        <label className="small">Name</label>
        <Field className="form-control" type="text" name="first" placeholder="Name"/>
        {touched.first && errors.first &&
        <small className="form-text text-danger">{errors.first}</small>}
      </fieldset>
      <fieldset className="col-md-6 form-group">
        <label className="small">Surname</label>
        <Field className="form-control" type="text" name="last" placeholder="Surname"/>
        {touched.last && errors.last &&
        <small className="form-text text-danger">{errors.last}</small>}
      </fieldset>
    </div>
    <fieldset className="form-group">
      <label className="small">Password</label>
      <Field className="form-control" type="password" name="password" placeholder="Password"/>
      {touched.password && errors.password &&
      <small className="form-text text-danger">{errors.password}</small>}
    </fieldset>
    {status && status.success && <div className="alert alert-success">
      <small>{status.success}</small>
    </div>}
    <p className="text-muted text-center small">By creating an account, you agree to our <Link
      to="/tos">Terms of Service</Link>&nbsp;
      and <Link to="/privacy">Privacy Policy</Link>.
    </p>
    <button className="btn btn-primary w-100" type="submit" disabled={isSubmitting}>
      {isSubmitting && <span><i className="fa fa-circle-notch fa-spin"/>&nbsp;</span>}
      Create my account
    </button>
    <p className="pt-4 text-center small">You can <Link to="/signin">sign in</Link> if you have an
      account
      already.</p>
  </Form>
);


@inject('AuthStore')
@observer
class EnhancedForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      username: '',
      first: '',
      last: '',
      born: '',
    }
  }

  handleSubmit = async (values, {resetForm, setSubmitting, setStatus}) => {
    setStatus(null);
    if (await this.props.AuthStore.createUserWithEmailPassword(values)) {
      setSubmitting(false);
      setStatus({'success': 'Your account has been created successfully!'})
      resetForm({});
    }
  };

  render() {
    const {authenticated} = this.props.AuthStore;
    if (authenticated) {
      const location = localStorage.getItem('location');
      return <Redirect to={location || '/dashboard'}/>
    } else
      return (
        <section className="cover min-vh-100 bg-light">
          <div className="container">
            <div className="row h-100 justify-content-md-center">
              <div className="col-sm-4 my-auto">
                <div className="row justify-content-md-center">
                  <Formik component={FormikForm}
                          enableReinitialize="true"
                          initialValues={{...this.state}}
                          validationSchema={Yup.object().shape({
                            email: Yup.string().email('Please write a correct email address').required('Email is required'),
                            password: Yup.string().min(8, 'Password must be 8 characters or longer')
                              .matches(/[a-z]/, 'Password must contain at least one lowercase char')
                              .matches(/[A-Z]/, 'Password must contain at least one uppercase char')
                              .matches(/[a-zA-Z]+[^a-zA-Z\s]+/, 'at least 1 number or special char (@,!,#, etc).')
                              .required('Password must be 8 characters or longer'),
                            last: Yup.string().required('Surname is required'),
                            first: Yup.string().required('Name is required'),
                          })}
                          onSubmit={this.handleSubmit}/>
                </div>
              </div>
            </div>
          </div>
        </section>)
  }
}

export default EnhancedForm
