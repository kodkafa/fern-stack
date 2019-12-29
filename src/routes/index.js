import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import {Redirect, Route, Switch} from 'react-router-dom';
import {Loader} from '../components/Loader';
import Layout from '../containers/Layout';
import SignUp from '../containers/Auth/SignUp';
import SignIn from '../containers/Auth/SignIn';
import SignOut from '../containers/Auth/SignOut';
import Reset from '../containers/Auth/Reset';
import NewPassword from '../containers/Auth/NewPassword';
import Welcome from '../containers/Welcome';
import Features from '../containers/Features';
import Home from '../containers/Home';
import Profile from '../containers/Profile';
import Me from '../containers/Profile/Me';
import Settings from '../containers/Settings';
import Users from '../containers/Users';
import User from '../containers/User';
import UserEdit from '../containers/User/Edit';
import NoMatch from '../containers/NoMatch';
import TermsOfService from "../containers/StaticPages/TermsOfService";
import PrivacyPolicy from "../containers/StaticPages/PrivacyPolicy";

const RestrictedRoute = ({component: Component, authenticated, ...rest}) =>
  <Route
    {...rest}
    render={props => authenticated
      ? <Component {...props} />
      : <Redirect
        to={{
          pathname: '/signin',
          state: {from: props.location}
        }}
      />
    }
  />;

@inject('AuthStore')
@observer
class Routes extends Component {

  componentDidMount() {
    const {authenticated, handleAuth} = this.props.AuthStore;
    // // window.addEventListener('resize', () => {
    // //   this.props.UIStore.updateWindowWidth(window.innerWidth)
    // // })
    //
    console.log('pathname', this.props.location);
    if (authenticated === null)
      handleAuth();
    else {
      console.log('location', this.props.location.pathname + this.props.location.search + this.props.location.hash);
      localStorage.setItem('location', this.props.location.pathname + this.props.location.search + this.props.location.hash);
    }
  }

  render() {
    //console.log('store', this.props.AuthStore, this.props);
    const {authenticated} = this.props.AuthStore;
    if (!['/signin', '/signup'].includes(this.props.location.pathname)) {
      localStorage.setItem('location', this.props.location.pathname + this.props.location.search + this.props.location.hash);
    }
    return (
      (authenticated === undefined) ? <Loader/>
        : <Layout>
          <Switch>
            <Route exact path="/" component={Welcome}/>
            <Route exact path="/features" component={Features}/>
            <Route exact path="/tos" component={TermsOfService}/>
            <Route exact path="/privacy" component={PrivacyPolicy}/>
            <Route exact path="/signin" component={SignIn}/>
            <Route exact path="/signout" component={SignOut}/>
            <Route exact path="/signup" component={SignUp}/>
            <Route exact path="/reset" component={Reset}/>
            <Route exact path="/newpassword/:token" component={NewPassword}/>

            <RestrictedRoute exact path="/home" component={Home} authenticated={authenticated}/>
            <RestrictedRoute exact path="/profile" component={Me} authenticated={authenticated}/>
            <RestrictedRoute exact path="/settings/:page?" component={Settings} authenticated={authenticated}/>
            <RestrictedRoute exact path="/users/:id" component={User} authenticated={authenticated}/>
            <RestrictedRoute exact path="/users/:id/edit" component={UserEdit} authenticated={authenticated}/>
            <RestrictedRoute exact path="/users/:page?/:id?" component={Users} authenticated={authenticated}/>

            <Route exact path="/:username" component={Profile}/>
            <Route component={NoMatch}/>
          </Switch>
        </Layout>
    )
  }
}


// const mapStateToProps = (state) => {
//   return {authenticated: state.auth.authenticated}
// };
export default Routes;//connect(mapStateToProps, {handleAuth})(Routes);
