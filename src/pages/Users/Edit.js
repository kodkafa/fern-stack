import {autorun} from "mobx";
import {inject, observer} from "mobx-react";
import React, {useState} from 'react';
import {useForm} from 'react-hook-form'
import * as Yup from 'yup'
import {useLocation, useParams} from "react-router-dom";
import moment from 'moment'
import qs from "query-string";

import {Input, Submit, TextArea, DatePicker} from "../../components";

export const Edit = inject(
  'AuthStore',
  'UserStore'
)(observer((props) => {

  const schema = Yup.object().shape({
    // username: Yup.string().required('Username is required'),
    // email: Yup.string().email('Please write a correct email address').required('Email is required'),
    first: Yup.string().required('Name is required'),
    last: Yup.string().required('Surname is required'),
    born: Yup.date().required('Birthday is required')
      .test('Birthday', 'Birthday should be greater than 18',
        (value) => moment().diff(moment(value), 'years') >= 18),
    bio: Yup.string()
      .min(10, 'Short bio  more than 10 characters or longer')
      .max(200, 'Short bio must be under 200 characters or shorter')
  })
  const {control, register, handleSubmit, errors, clearError, setError} = useForm({
    validationSchema: schema
  });
  const [loading, setLoading] = useState(false);

  const location = useLocation()
  const params = {...useParams(), ...qs.parse(location.search)} // !IMPORTANT for deps
  const {id} = params

  autorun(() => {
    props.UserStore.getUserById(id);
  });

  const item = props.UserStore.list.get(id)
  //console.log(item.born, new Date())

  const onSubmit = async (data) => {
    clearError();
    setLoading(true)
    try {
      console.log({data})
      props.UserStore.updateUserById({id, ...data});
      //setStatus({'success': 'Your account has been updated successfully!'});
    } catch (errors) {
      console.log(errors)
      setError(errors);
    }
    setTimeout(() => setLoading(false), 500)
  }

  return (
    <section className="container">
      {item === undefined
        ? <div className="row justify-content-md-center"><i className="fa fa-circle-notch fa-spin fa-3x"/></div>
        : <div className="row justify-content-md-center">
          <div className="col-md-6">
            <form className="vertical between stretch" onSubmit={handleSubmit(onSubmit)}>
              <div className="row">
                <Input className="col-md-6"
                       label="Name"
                       name="first"
                       placeholder="first name"
                       defaultValue={item.first}
                       ref={register({required: true})}
                       errors={errors}/>
                <Input className="col-md-6"
                       label="Surname"
                       name="last"
                       placeholder="last name"
                       defaultValue={item.first}
                       ref={register({required: true})}
                       errors={errors}/>
              </div>
              <DatePicker className=""
                          label="Birthday"
                          name="born"
                          defaultValue={item.born || new Date()}
                          startDate={new Date('1900-01-01')}
                          endDate={new Date('2002-01-01')}
                          dateFormat="d MMMM yyyy"
                          register={register({required: true})}
                          errors={errors}
                          control={control}/>
              <TextArea className=""
                        label="Bio"
                        name="bio"
                        placeholder="Write something short about you ..."
                        defaultValue={item.bio}
                        ref={register({})}
                        errors={errors}/>
              {/*<input type="hidden" name="id" value={item.id}/>*/}
              <Submit className=""
                      name="Update the Account"
                      loading={loading}/>
            </form>
          </div>
        </div>
      }
    </section>
  )
}));
//
//
// @inject('AuthStore', 'UserStore')
// @observer
// class EnhancedForm extends Component {
//   constructor(props) {
//     super(props);
//     autorun(() => {
//       props.UserStore.getUserById(props.match.params.id);
//     });
//
//     this.state = {
//       id: props.match.params.id,
//       user: {
//         id: props.match.params.id,
//         // username: '',
//         // email: '',
//         first: '',
//         last: '',
//         born: '',
//         bio: '',
//         roles: []
//       }
//     }
//   }
//
//   // getUserData(id) {
//   //   if (!this.state.user || id !== this.state.user.id)
//   //     getUser(id)
//   //       .then(user => {
//   //         this.setState({user: user})
//   //       })
//   //       .catch(error => {
//   //         this.setState({'error': error})
//   //       })
//   // }
//
//   // componentDidMount() {
//   //   if (!props.me || !props.me.isAdmin)
//   //     return History.goBack();
//   //   this.getUserData(props.match.params.id)
//   // }
//
//   handleSubmit = (values, {props, setinputError, setSubmitting, setStatus}) => {
//     setStatus(null);
//     try {
//       props.UserStore.updateUserById(values);
//       setStatus({'success': 'Your account has been updated successfully!'});
//       setSubmitting(false);
//     } catch (errors) {
//       console.log(errors)
//       setStatus({'error': errors});
//       setSubmitting(false);
//     }
//   };
//
//
//   toggleClaim = async (e) => {
//     const el = e.currentTarget;
//     const position = el.dataset.position;
//     const defaultClass = el.getElementsByTagName('i')[0].className;
//     el.disabled = true;
//     el.getElementsByTagName('i')[0].className = 'fa fa-circle-notch fa-spin';
//     try {
//       const user = props.UserStore.list.get(this.state.id);
//       await user.toggleClaim(position);
//       el.disabled = false;
//       el.getElementsByTagName('i')[0].className = defaultClass
//     } catch (error) {
//       console.log('error', error);
//       el.disabled = false;
//       el.getElementsByTagName('i')[0].className = defaultClass
//     }
//   };
//
//   render() {
//     console.log('props.UserStore.list', props.UserStore.list);
//     const user = props.UserStore.list.get(this.state.id);
//     if (user === undefined)
//       return <section className="container">
//         <div className="row justify-content-md-center"><i className="fa fa-circle-notch fa-spin fa-3x"/>
//         </div>
//       </section>;
//     return (
//       <section className="container">
//         <div className="row justify-content-md-center">
//           <div className="col-md-6">
//             <Formik component={FormikForm}
//                     enableReinitialize="true"
//                     initialValues={user}
//                     validationSchema={Yup.object().shape({
//                       // username: Yup.string().required('Username is required'),
//                       // email: Yup.string().email('Please write a correct email address').required('Email is required'),
//                       // name: Yup.string().required('Name is required'),
//                       // surname: Yup.string().required('Surname is required'),
//                       // bio: Yup.string().max(200, 'Short bio must be under 200 characters or shorter')
//                     })}
//                     onSubmit={this.handleSubmit}/>
//             <hr/>
//             <div>
//               <div id="errorMessage"/>
//               <button data-position="admin" className={user.isAdmin ? 'btn btn-danger' : 'btn btn-secondary'}
//                       onClick={this.toggleClaim}>
//                 <i className="fa fa-user-astronaut"/> Admin
//               </button>
//               <button data-position="editor" className={user.isEditor ? 'btn btn-danger ml-1' : 'btn btn-secondary ml-1'}
//                       onClick={this.toggleClaim}>
//                 <i className="fa fa-user-graduate"/> Editor
//               </button>
//               <button data-position="manager" className={user.isManager ? 'btn btn-danger ml-1' : 'btn btn-secondary ml-1'}
//                       onClick={this.toggleClaim}>
//                 <i className="fa fa-user-secret"/> Manager
//               </button>
//               <button data-position="worker" className={user.isWorker ? 'btn btn-danger ml-1' : 'btn btn-secondary ml-1'}
//                       onClick={this.toggleClaim}>
//                 <i className="fa fa-user-tie"/> Worker
//               </button>
//               <button data-position="user" className={user.isUser ? 'btn btn-danger ml-1' : 'btn btn-secondary ml-1'}
//                       onClick={this.toggleClaim}>
//                 <i className="fa fa-user-check"/> User
//               </button>
//             </div>
//           </div>
//         </div>
//       </section>)
//   }
// }
//
// //
// // const mapStateToProps = (state) => {
// //     return {me: state.auth.me}
// // }
//
// export default EnhancedForm//connect(mapStateToProps, null)(EnhancedForm);
