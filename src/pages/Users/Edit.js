import React, {Component} from 'react';
import {Field, Form, Formik} from 'formik'
import * as Yup from 'yup'
import {inject, observer} from "mobx-react";
import {autorun} from "mobx";
import DatePicker from "react-datepicker";
//import {connect} from 'react-redux'
//import History from "../../history";


const FormikForm = ({
                      values,
                      touched,
                      errors,
                      setFieldValue,
                      isSubmitting
                    }) => (
  <Form>
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
    <input type="hidden" name="id" value={values.id}/>
    <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
      {isSubmitting && <span><i className="fa fa-circle-notch fa-spin"/>&nbsp;</span>}
      Update the Account
    </button>
  </Form>);


@inject('AuthStore', 'UserStore')
@observer
class EnhancedForm extends Component {
  constructor(props) {
    super(props);
    autorun(() => {
      this.props.UserStore.getUserById(props.match.params.id);
    });

    this.state = {
      id: props.match.params.id,
      user: {
        id: props.match.params.id,
        // username: '',
        // email: '',
        first: '',
        last: '',
        born: '',
        bio: '',
        roles: []
      }
    }
  }

  // getUserData(id) {
  //   if (!this.state.user || id !== this.state.user.id)
  //     getUser(id)
  //       .then(user => {
  //         this.setState({user: user})
  //       })
  //       .catch(error => {
  //         this.setState({'error': error})
  //       })
  // }

  // componentDidMount() {
  //   if (!this.props.me || !this.props.me.isAdmin)
  //     return History.goBack();
  //   this.getUserData(this.props.match.params.id)
  // }

  handleSubmit = (values, {props, setFieldError, setSubmitting, setStatus}) => {
    setStatus(null);
    try {
      this.props.UserStore.updateUserById(values);
      setStatus({'success': 'Your account has been updated successfully!'});
      setSubmitting(false);
    } catch (errors) {
      console.log(errors)
      setStatus({'error': errors});
      setSubmitting(false);
    }
  };


  toggleClaim = async (e) => {
    const el = e.currentTarget;
    const position = el.dataset.position;
    const defaultClass = el.getElementsByTagName('i')[0].className;
    el.disabled = true;
    el.getElementsByTagName('i')[0].className = 'fa fa-circle-notch fa-spin';
    try {
      const user = this.props.UserStore.list.get(this.state.id);
      await user.toggleClaim(position);
      el.disabled = false;
      el.getElementsByTagName('i')[0].className = defaultClass
    } catch (error) {
      console.log('error', error);
      el.disabled = false;
      el.getElementsByTagName('i')[0].className = defaultClass
    }
  };

  render() {
    console.log('this.props.UserStore.list', this.props.UserStore.list);
    const user = this.props.UserStore.list.get(this.state.id);
    if (user === undefined)
      return <section className="container">
        <div className="row justify-content-md-center"><i className="fa fa-circle-notch fa-spin fa-3x"/>
        </div>
      </section>;
    return (
      <section className="container">
        <div className="row justify-content-md-center">
          <div className="col-md-6">
            <Formik component={FormikForm}
                    enableReinitialize="true"
                    initialValues={user}
                    validationSchema={Yup.object().shape({
                      // username: Yup.string().required('Username is required'),
                      // email: Yup.string().email('Please write a correct email address').required('Email is required'),
                      // name: Yup.string().required('Name is required'),
                      // surname: Yup.string().required('Surname is required'),
                      // bio: Yup.string().max(200, 'Short bio must be under 200 characters or shorter')
                    })}
                    onSubmit={this.handleSubmit}/>
            <hr/>
            <div>
              <div id="errorMessage"/>
              <button data-position="admin" className={user.isAdmin ? 'btn btn-danger' : 'btn btn-secondary'}
                      onClick={this.toggleClaim}>
                <i className="fa fa-user-astronaut"/> Admin
              </button>
              <button data-position="editor" className={user.isEditor ? 'btn btn-danger ml-1' : 'btn btn-secondary ml-1'}
                      onClick={this.toggleClaim}>
                <i className="fa fa-user-graduate"/> Editor
              </button>
              <button data-position="manager" className={user.isManager ? 'btn btn-danger ml-1' : 'btn btn-secondary ml-1'}
                      onClick={this.toggleClaim}>
                <i className="fa fa-user-secret"/> Manager
              </button>
              <button data-position="worker" className={user.isWorker ? 'btn btn-danger ml-1' : 'btn btn-secondary ml-1'}
                      onClick={this.toggleClaim}>
                <i className="fa fa-user-tie"/> Worker
              </button>
              <button data-position="user" className={user.isUser ? 'btn btn-danger ml-1' : 'btn btn-secondary ml-1'}
                      onClick={this.toggleClaim}>
                <i className="fa fa-user-check"/> User
              </button>
            </div>
          </div>
        </div>
      </section>)
  }
}

//
// const mapStateToProps = (state) => {
//     return {me: state.auth.me}
// }

export default EnhancedForm//connect(mapStateToProps, null)(EnhancedForm);
