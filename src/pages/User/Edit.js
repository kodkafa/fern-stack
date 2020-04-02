import React, {Component} from 'react';
import {Field, Form, Formik} from 'formik'
import * as Yup from 'yup';
import {inject, observer} from "mobx-react";
import {autorun} from "mobx";
import DatePicker from "react-datepicker";
import {Loader} from "../../components";

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
        first: '',
        last: '',
        born: '',
        bio: '',
        roles: []
      }
    }
  }

  // componentDidMount() {
  //   if (!this.props.me || !this.props.me.isAdmin)
  //     return History.goBack();
  //   this.getUserData(this.props.match.params.id)
  // }

  handleSubmit = (values, {props, setFieldError, setSubmitting, setStatus}) => {
    console.log('values', values);
    setStatus(null);
    try {

      console.log('values', values);
      this.props.UserStore.updateUserById(values);
      setStatus({'success': 'Your account has been updated successfully!'});
      setSubmitting(false);
    } catch (errors) {
      console.log(errors)
      setStatus({'error': errors});
      setSubmitting(false);
    }
  };

  async toggleAdmin(e) {
    console.log({user});
    const user = this.props.UserStore.list.get(this.state.id);
    console.log({user});
    // return await user.toggleAdmin();
    //
    // let el = e.currentTarget;
    // document.getElementById('errorMessage').innerHTML = '';
    // el.disabled = true;
    // el.getElementsByTagName('i')[0].className = 'fa fa-circle-notch fa-spin';
    // try {
    //   let data = await toggleAdmin(el.dataset.id, el.dataset.fk);
    //   el.disabled = false;
    //   el.getElementsByTagName('i')[0].className = 'fa fa-user-secret';
    //   el.className = data && data.id ? 'btn btn-danger' : 'btn btn-secondary';
    // } catch (error) {
    //   el.disabled = false;
    //   el.getElementsByTagName('i')[0].className = 'fa fa-user-secret';
    //   document.getElementById('errorMessage').innerHTML = '<div class="alert alert-danger">' + error + '</div>';
    // }
  }

  //
  // async toggleEditor(e) {
  //   let el = e.currentTarget;
  //   document.getElementById('errorMessage').innerHTML = '';
  //   el.disabled = true;
  //   el.getElementsByTagName('i')[0].className = 'fa fa-circle-notch fa-spin';
  //   try {
  //     let data = await toggleEditor(el.dataset.id, el.dataset.fk);
  //     el.disabled = false;
  //     el.getElementsByTagName('i')[0].className = 'fa fa-user-tie';
  //     el.className = data && data.id ? 'btn btn-warning ml-1' : 'btn btn-secondary ml-1';
  //   } catch (error) {
  //     el.disabled = false;
  //     el.getElementsByTagName('i')[0].className = 'fa fa-user-tie';
  //     document.getElementById('errorMessage').innerHTML = '<div class="alert alert-danger">' + error + '</div>';
  //   }
  // }

  render() {
    console.log('this.props.UserStore.list', this.props.UserStore.list);
    const user = this.props.UserStore.list.get(this.state.id);
    console.log('user', user);
    if (user === undefined)
      return <section className="container">
        <Loader/>
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

              <button data-id={user.uid} data-fk={user.isAdmin()}
                      className={user.isAdmin() ? 'btn btn-danger' : 'btn btn-secondary'}
                      onClick={(e) => this.toggleAdmin(e)}>
                <i className="fa fa-user-secret"/> Admin
              </button>
              <button data-id={user.uid} data-fk={user.isEditor()}
                      className={user.isEditor() ? 'btn btn-warning ml-1' : 'btn btn-secondary ml-1'}
                      onClick={(e) => this.toggleEditor(e)}>
                <i className="fa fa-user-tie"/> Editor
              </button>
            </div>
          </div>
        </div>
      </section>)
  }
}

export default EnhancedForm
