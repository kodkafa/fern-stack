import {inject, observer} from "mobx-react";
import React, {Component} from 'react';
import {Field, Form, Formik} from 'formik'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as Yup from 'yup'

const FormikForm = ({
                      values,
                      touched,
                      errors,
                      status,
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
    {status && status.success && <div className="alert alert-success">
      <small>{status.success}</small>
    </div>}
    <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
      {isSubmitting && <span><i className="fa fa-circle-notch fa-spin"/>&nbsp;</span>}
      Update my Account
    </button>
  </Form>
);

@inject('AuthStore', 'UserStore')
@observer
class EnhancedForm extends Component {
  handleSubmit = async (values, {setSubmitting, setStatus}) => {
    setStatus(null);
    if (await this.props.UserStore.updateMe(values)) {
      setSubmitting(false);
      setStatus({'success': 'Your account has been created successfully!'});
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
                  first: Yup.string().required('Name is required'),
                  last: Yup.string().required('Surname is required'),
                })}
                onSubmit={this.handleSubmit}/>
      </div>)
  }
}

export default EnhancedForm
