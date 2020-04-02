import {inject, observer} from "mobx-react";
import React, {Component} from 'react';
import {Link, Redirect} from 'react-router-dom';
import {Field, Form, Formik} from 'formik'
import * as Yup from 'yup'

const FormikForm = ({
                      touched,
                      status,
                      errors,
                      isSubmitting
                    }) => (
  <Form className="card border-0 p-4 shadow">
    <h1 className="h4 lined"><span>SIGN IN</span></h1>
    <fieldset className="form-group">
      <label className="small">Email</label>
      <Field className="form-control" type="text" name="email" placeholder="email"/>
      {touched.email && errors.email &&
      <small className="form-text text-danger">{errors.email}</small>}
    </fieldset>
    <fieldset className="form-group">
      <label className="small">Password</label>
      <Field className="form-control" type="password" name="password" placeholder="Password"/>
      {touched.password && errors.password &&
      <small className="form-text text-danger">{errors.password}</small>}
    </fieldset>
    {status && status.success && <div className="alert alert-success">
      <small>{status.success}</small>
    </div>}
    <button className="btn btn-primary w-100" type="submit" disabled={isSubmitting}>
      {isSubmitting && <span><i className="fa fa-circle-notch fa-spin"/>&nbsp;</span>}
      Login
    </button>
    <p className="pt-4 text-center small">You can <Link to="/signup">sign up</Link> easly
      if you don't have an account yet. Or you have an issue about sign in you can
      reset your password <Link to="/reset">here</Link></p>
  </Form>
);

@inject( 'AuthStore')
@observer
class EnhancedForm extends Component {
  constructor() {
    super();
    this.state = {
      email: null,
      password: null
    }
  }

  componentDidMount() {
    const auth = document.getElementById('auth');
    if (auth) auth.style.height = window.innerHeight + 'px';
  }

  handleSubmit = async (values, {setSubmitting, setStatus}) => {
    setStatus(null);
    if (await this.props.AuthStore.signIn(values)) {
      setSubmitting(false);
      setStatus({'success': 'Your account has been updated successfully!'});
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
                          initialValues={{
                            email: this.state.email || '',
                            password: ''
                          }}
                          validationSchema={Yup.object().shape({
                            email: Yup.string().email('Please write a correct email address').required('Email is required'),
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
