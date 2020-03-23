import {inject, observer} from "mobx-react";
import React, {Component} from 'react';
import {Field, Form, Formik} from 'formik'
import * as Yup from 'yup';
import {ToggleButton} from '../../components';

const FormikForm = ({
                      values,
                      touched,
                      errors,
                      status,
                      isSubmitting
                    }) => (
  <Form>
    <fieldset className="form-group">
      <Field className="form-control" type="text" name="username" placeholder="Username"/>
      {touched.username && errors.username && <small className="form-text text-danger">{errors.username}</small>}
    </fieldset>
    <fieldset className="form-group">
      <Field className="form-control" type="text" name="email" placeholder="email@email.com"/>
      {touched.email && errors.email && <small className="form-text text-danger">{errors.email}</small>}
    </fieldset>
    <div className="row">
      <fieldset className="col-md-6 form-group">
        <label>Name</label>
        <Field className="form-control" type="text" name="name" placeholder="Name"/>
        {touched.name && errors.name && <small className="form-text text-danger">{errors.name}</small>}
      </fieldset>
      <fieldset className="col-md-6 form-group">
        <label>Surname</label>
        <Field className="form-control" type="text" name="surname" placeholder="Surname"/>
        {touched.surname && errors.surname && <small className="form-text text-danger">{errors.surname}</small>}
      </fieldset>
    </div>
    <fieldset className="form-group">
      <Field className="form-control" component="textarea" name="bio"
             placeholder="Write something short about you"/>
      {touched.bio && errors.bio && <small className="form-text text-danger">{errors.bio}</small>}
    </fieldset>
    {status && status.error && <div className="alert alert-danger">
      <small>{status.error}</small>
    </div>}
    {status && status.success && <div className="alert alert-success">
      <small>{status.success}</small>
    </div>}
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
    this.state = {
      user: props.user || {},
      // user: {
      //     id: '',
      //     username: '',
      //     email: '',
      //     name: '',
      //     surname: '',
      //     bio: '',
      //     roles: []
      // },
      error: null
    }
  }

  getUserData(id) {
    if (!this.state.user || id !== this.state.user.id)
      this.props.UserStore.getUserById(id)
        .then(user => {
          this.setState({user: user})
        })
        .catch(error => {
          this.setState({'error': error})
        })
  }

  componentDidMount() {
    this.props.UserStore.getUserById(this.props.match.params.id);
    // if (!this.props.me || (!this.props.me.isAdmin && !this.props.me.isEditor))
    //     return History.goBack();
    // this.getUserData(this.props.match.params.id)
  }

  // componentDidUpdate = (props) => {
  //   if (props.user && this.props.user !== props.user)
  //     this.setState({
  //       user: props.user,
  //       loading: false
  //     });
  // };

  async handleSubmit(values, {props, setFieldError, setSubmitting, setStatus}) {
    setStatus(null);
    try {
      await this.props.UserStore.updateUser(values);
      setStatus({'success': 'Your account has been updated successfully!'});
      setSubmitting(false);
    } catch (errors) {
      setStatus({'error': errors});
      setSubmitting(false);
    }
  }

  toggleAdmin(id) {
    this.setState({
      error: null,
    });
    this.props.UserStore.toggleAdmin(id)
  }

  toggleEditor(id) {
    this.setState({
      error: null,
    });
    this.props.UserStore.toggleEditor(id)
  }

  toggleManager(id) {
    this.setState({
      error: null,
    });
    this.props.UserStore.toggleManager(id)
  }

  toggleWorker(id) {
    this.setState({
      error: null,
    });
    this.props.UserStore.toggleWorker(id)
  }

  toggleStatus(id) {
    this.setState({
      error: null,
    });
    this.props.UserStore.toggleStatus(id)
  }


  render() {
    const user = this.props.UserStore.data;
    console.log({user})
    return (
      <div className="row justify-content-md-center">
        {!user
          ? <div>LOADING</div>
          : <div className="col-md-6">
            <Formik component={FormikForm}
                    enableReinitialize="true"
                    initialValues={{
                      id: user.id || '',
                      username: user.username || '',
                      email: user.email || '',
                      name: user.name || '',
                      surname: user.surname || '',
                      bio: user.bio || '',
                    }}
                    validationSchema={Yup.object().shape({
                      username: Yup.string().required('Username is required'),
                      email: Yup.string().email('Please write a correct email address').required('Email is required'),
                      name: Yup.string().required('Name is required'),
                      surname: Yup.string().required('Surname is required'),
                      bio: Yup.string().max(200, 'Short bio must be under 200 characters or shorter')
                    })}
                    onSubmit={this.handleSubmit}/>
            <hr/>
            <div>
              {this.state.error && <div className="alert alert-danger" role="alert">{this.state.error}</div>}
              <table className="table">
                <tbody>
                  <tr>
                    <th>Admin</th>
                    <th>Editor</th>
                    <th>Manager</th>
                    <th>Worker</th>
                    <th>Status</th>
                  </tr>
                  <tr>
                    <td>
                      <ToggleButton status={user.isAdmin}
                                    toggleFunction={() => this.toggleAdmin(user.id)}/>
                    </td>
                    <td>
                      <ToggleButton status={user.isEditor}
                                    toggleFunction={() => this.toggleEditor(user.id)}/>
                    </td>
                    <td>
                      <ToggleButton status={user.isManager}
                                    toggleFunction={() => this.toggleManager(user.id)}/>
                    </td>
                    <td>
                      <ToggleButton status={user.isWorker}
                                    toggleFunction={() => this.toggleWorker(user.id)}/>
                    </td>
                    <td>
                      <ToggleButton status={user.status}
                                    toggleFunction={() => this.toggleStatus(user.id)}/>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        }
      </div>)
  }
}

export default EnhancedForm
