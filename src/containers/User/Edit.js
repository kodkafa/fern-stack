import React, {Component} from 'react';
import {Field, Form, Formik} from 'formik'
import * as Yup from 'yup'
import {getUser, toggleAdmin, toggleEditor, updateUser} from 'actions'
//import {connect} from 'react-redux'
//import History from "../../history";


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
            {isSubmitting && <span><i className="fa fa-circle-notch fa-spin"></i>&nbsp;</span>}
            Update the Account
        </button>
    </Form>);

class EnhancedForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            user: {
                id: '',
                username: '',
                email: '',
                name: '',
                surname: '',
                bio: '',
                roles: []
            }
        }
    }

    getUserData(id) {
        if (!this.state.user || id !== this.state.user.id)
            getUser(id)
                .then(user => {
                    this.setState({user: user})
                })
                .catch(error => {
                    this.setState({'error': error})
                })
    }

    componentDidMount() {
        if (!this.props.me || !this.props.me.isAdmin)
            return History.goBack();
        this.getUserData(this.props.match.params.id)
    }

    async handleSubmit(values, {props, setFieldError, setSubmitting, setStatus}) {
        setStatus(null);
        try {
            await updateUser(values);
            setStatus({'success': 'Your account has been updated successfully!'})
            setSubmitting(false);
        } catch (errors) {
            setStatus({'error': errors})
            setSubmitting(false);
        }
    }

    async toggleAdmin(e) {
        let el = e.currentTarget;
        document.getElementById('errorMessage').innerHTML = '';
        el.disabled = true;
        el.getElementsByTagName('i')[0].className = 'fa fa-circle-notch fa-spin';
        try {
            let data = await toggleAdmin(el.dataset.id, el.dataset.fk);
            el.disabled = false;
            el.getElementsByTagName('i')[0].className = 'fa fa-user-secret';
            el.className = data && data.id ? 'btn btn-danger' : 'btn btn-secondary';
        } catch (error) {
            el.disabled = false;
            el.getElementsByTagName('i')[0].className = 'fa fa-user-secret';
            document.getElementById('errorMessage').innerHTML = '<div class="alert alert-danger">' + error + '</div>';
        }
    }

    async toggleEditor(e) {
        let el = e.currentTarget;
        document.getElementById('errorMessage').innerHTML = '';
        el.disabled = true;
        el.getElementsByTagName('i')[0].className = 'fa fa-circle-notch fa-spin';
        try {
            let data = await toggleEditor(el.dataset.id, el.dataset.fk);
            el.disabled = false;
            el.getElementsByTagName('i')[0].className = 'fa fa-user-tie';
            el.className = data && data.id ? 'btn btn-warning ml-1' : 'btn btn-secondary ml-1';
        } catch (error) {
            el.disabled = false;
            el.getElementsByTagName('i')[0].className = 'fa fa-user-tie';
            document.getElementById('errorMessage').innerHTML = '<div class="alert alert-danger">' + error + '</div>';
        }
    }

    render() {
        let adminRole = this.state.user.roles.find(x => x.name === 'admin');
        let editorRole = this.state.user.roles.find(x => x.name === 'editor');
        return (
            <section className="container">
                <div className="row justify-content-md-center">
                    <div className="col-md-6">
                        <Formik component={FormikForm}
                                enableReinitialize="true"
                                initialValues={{
                                    id: this.state.user.id || '',
                                    username: this.state.user.username || '',
                                    email: this.state.user.email || '',
                                    name: this.state.user.name || '',
                                    surname: this.state.user.surname || '',
                                    bio: this.state.user.bio || '',
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
                            <div id="errorMessage"></div>
                            <button data-id={this.state.user.id} data-fk={adminRole && adminRole.id}
                                    className={adminRole ? 'btn btn-danger' : 'btn btn-secondary'}
                                    onClick={(e) => this.toggleAdmin(e)}>
                                <i className="fa fa-user-secret"/> Admin
                            </button>
                            <button data-id={this.state.user.id} data-fk={editorRole && editorRole.id}
                                    className={editorRole ? 'btn btn-warning ml-1' : 'btn btn-secondary ml-1'}
                                    onClick={(e) => this.toggleEditor(e)}>
                                <i className="fa fa-user-tie"/> Editor
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
