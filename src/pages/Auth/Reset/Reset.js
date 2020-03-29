import React, {Component} from 'react';
import {Link, Redirect} from 'react-router-dom';
import {Field, Form, Formik} from 'formik';
import * as Yup from 'yup';
import {inject, observer} from "mobx-react";

const FormikForm = ({
                        touched,
                        errors,
                        isSubmitting
                    }) => (
    <section id="auth" className="cover  bg-light">
        <div className="container">
            <div className="row h-100 justify-content-md-center">
                <div className="col-sm-4 my-auto">
                    <Form className="card border-0 p-4 shadow">
                        <h1 className="h4 lined"><span>RESET</span></h1>
                        <fieldset className="form-group">
                            <label className="small">Email</label>
                            <Field className="form-control" type="text" name="email" placeholder="email"/>
                            {touched.email && errors.email &&
                            <small className="form-text text-danger">{errors.email}</small>}
                        </fieldset>
                        <button className="btn btn-primary w-100" type="submit" disabled={isSubmitting}>
                            {isSubmitting && <span><i className="fa fa-circle-notch fa-spin"/>&nbsp;</span>}
                            Send a reset email
                        </button>
                        <p className="pt-4 text-center small"><Link to="/signin">return to login page</Link></p>
                    </Form>
                </div>
            </div>
        </div>
    </section>
);

@inject('AuthStore')
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

  handleSubmit = (values, {props, setFieldError, setSubmitting, setStatus}) => {

    //
    // if (values.email.match(/^[A-z0-9._%+-]+@[A-z0-9.-]+\.[A-z0-9.]{2,}$/))
    //   values = {email: values.email, password: values.password};

    console.log('on submit', values);

    setStatus(null);
    try {
      this.props.AuthStore.reset(values);
      setStatus({'success': 'Your account has been updated successfully!'});
      setSubmitting(false);
    } catch (errors) {
      setStatus({'error': errors});
      setSubmitting(false);
    }

  };

  render() {
    const {authenticated} = this.props.AuthStore;
    if (authenticated) {
      const location = localStorage.getItem('location');
      return <Redirect to={location || '/home'}/>
    } else
      return (
        <div className="row justify-content-md-center">
          <Formik component={FormikForm}
                  enableReinitialize="true"
                  initialValues={{
                    email: this.state.email || '',
                  }}
                  validationSchema={Yup.object().shape({
                    email: Yup.string().email('Please write a correct email address').required('Email is required'),
                  })}
                  onSubmit={this.handleSubmit}/>
        </div>)
  }
}

export default EnhancedForm

// const EnhancedForm = withFormik({
//     mapPropsToValues() {
//         return {
//             email: ''
//         }
//     },
//     validationSchema: Yup.object().shape({
//         email: Yup.string().email('Please write a correct email address').required('Email is required'),
//     }),
//     handleSubmit(values, {props}) {
//         // setSubmittingHigher = () => {
//         //     setSubmitting();
//         //     resetForm();
//         // };
//         props.resetPasswordRequest(values.email)
//     }
// })(FormikForm);
//
// export default EnhancedForm
