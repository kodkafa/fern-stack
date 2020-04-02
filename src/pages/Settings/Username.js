import {inject, observer} from "mobx-react";
import React, {Component} from 'react';
import {Field, Form, Formik} from 'formik'
import * as Yup from 'yup'

const FormikForm = ({
                      touched,
                      status,
                      errors,
                      isSubmitting
                    }) => (
  <Form className="col-md-6">
    <fieldset className="form-group">
      <Field className="form-control" type="text" name="username" placeholder="Username"/>
      {touched.username && errors.username &&
      <small className="form-text text-danger">{errors.username}</small>}
    </fieldset>
    {status && status.success && <div className="alert alert-success">
      <small>{status.success}</small>
    </div>}
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

  handleSubmit = async (values, {setSubmitting, setStatus}) => {
    setStatus(null);
    if (await this.props.AuthStore.me.changeUsername(values.username)) {
      setSubmitting(false);
      setStatus({'success': 'Your username has been changed successfully!'});
    }
  };

  render() {
    return (
      <div className="row justify-content-md-center">
        <Formik component={FormikForm}
                enableReinitialize="true"
                initialValues={{username: this.props.AuthStore.me.username}}
                validationSchema={Yup.object().shape({
                  username: Yup.string().min(5).max(22).matches(/^[A-Za-z0-9]+(?:[._-][A-Za-z0-9]+)*$/, 'Username only contain english characters and (_,-,.). Also usernames must start and end with a letter or number.')
                })}
                onSubmit={this.handleSubmit}/>
      </div>)
  }
}

export default EnhancedForm
