import React, {Component} from 'react';
import {Link, Redirect} from 'react-router-dom';
import {Field, Form, Formik} from 'formik';
import * as Yup from 'yup';
import {inject, observer} from "mobx-react";

const FormikForm = ({
                      touched,
                      status,
                      errors,
                      isSubmitting
                    }) => (
  <Form className="card border-0 p-4 shadow">
    <h1 className="h4 lined"><span>RESET</span></h1>
    <fieldset className="form-group">
      <label className="small">Email</label>
      <Field className="form-control" type="text" name="email" placeholder="email"/>
      {touched.email && errors.email &&
      <small className="form-text text-danger">{errors.email}</small>}
    </fieldset>
    {status && status.success && <div className="alert alert-success">
      <small>{status.success}</small>
    </div>}
    <button className="btn btn-primary w-100" type="submit" disabled={isSubmitting}>
      {isSubmitting && <span><i className="fa fa-circle-notch fa-spin"/>&nbsp;</span>}
      Send a reset email
    </button>
    <p className="pt-4 text-center small"><Link to="/signin">return to login page</Link></p>
  </Form>
);

@inject('AuthStore')
@observer
class EnhancedForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: null
    }
  }

  handleSubmit = async (values, {resetForm, setSubmitting, setStatus}) => {
    setStatus(null);
    if (await this.props.AuthStore.reset(values)) {
      resetForm({});
      setSubmitting(false);
      setStatus({'success': 'We sent you an instruction email.'});
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
                <Formik component={FormikForm}
                        enableReinitialize="true"
                        initialValues={{
                          email: this.state.email || '',
                        }}
                        validationSchema={Yup.object().shape({
                          email: Yup.string().email('Please write a correct email address').required('Email is required'),
                        })}
                        onSubmit={this.handleSubmit}/>
              </div>
            </div>
          </div>
        </section>)
  }
}

export default EnhancedForm
