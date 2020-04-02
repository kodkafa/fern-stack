import React, {Component} from 'react';
import {Field, Form, Formik} from 'formik';
import * as Yup from 'yup';
import {inject, observer} from "mobx-react";

const FormikForm = ({
                      touched,
                      status,
                      errors,
                      isSubmitting
                    }) => (
  <Form className="col-md-6">
    <fieldset className="form-group">
      <label>Old Password</label>
      <Field className="form-control" type="password" name="currentPassword" placeholder="Old Password"/>
      {touched.currentPassword && errors.currentPassword &&
      <small className="form-text text-danger">{errors.currentPassword}</small>}
    </fieldset>
    <fieldset className="form-group">
      <label>New Password</label>
      <Field className="form-control" type="password" name="newPassword" placeholder="New Password"/>
      {touched.newPassword && errors.newPassword &&
      <small className="form-text text-danger">{errors.newPassword}</small>}
    </fieldset>
    <fieldset className="form-group">
      <label>Confirm New Password</label>
      <Field className="form-control" type="password" name="passwordConfirmation"
             placeholder="New Password Confirmation"/>
      {touched.passwordConfirmation && errors.passwordConfirmation &&
      <small className="form-text text-danger">{errors.passwordConfirmation}</small>}
    </fieldset>
    {status && status.success && <div className="alert alert-success">
      <small>{status.success}</small>
    </div>}
    <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
      {isSubmitting && <span><i className="fa fa-circle-notch fa-spin"/>&nbsp;</span>}
      Change my password
    </button>
  </Form>
);


@inject('AuthStore', 'UserStore')
@observer
class EnhancedForm extends Component {
  handleSubmit = async (values, {resetForm, setSubmitting, setStatus}) => {
    setStatus(null);
    if (await this.props.AuthStore.changeUserPassword(values)) {
      resetForm({}); // TODO it does not work!
      setSubmitting(false);
      setStatus({'success': 'Your password has been changed successfully!'});
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
                  currentPassword: Yup.string().min(3, 'Password must be 3 characters or longer').required('Password is required'),
                  newPassword: Yup.string().min(8, 'Password must be 8 characters or longer')
                    .matches(/[a-z]/, 'Password must contain at least one lowercase char')
                    .matches(/[A-Z]/, 'Password must contain at least one uppercase char')
                    .matches(/[a-zA-Z]+[^a-zA-Z\s]+/, 'at least 1 number or special char (@,!,#, etc).'),
                  passwordConfirmation: Yup.string()
                    .oneOf([Yup.ref('newPassword'), null], 'Passwords do not match').required('Password is required')
                })}
                onSubmit={this.handleSubmit}/>
      </div>)
  }
}

export default EnhancedForm
