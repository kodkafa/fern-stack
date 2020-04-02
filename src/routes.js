import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import {Redirect, Route, Switch} from 'react-router-dom';
import {Loader} from './components/Loader';
import {LayoutDefault, LayoutGuest, LayoutWelcome} from './layouts';
import SignUp from './pages/Auth/SignUp';
import SignIn from './pages/Auth/SignIn';
import SignOut from './pages/Auth/SignOut';
import Reset from './pages/Auth/Reset';
import NewPassword from './pages/Auth/NewPassword';
import Welcome from './pages/Welcome';
import Features from './pages/Features';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Me from './pages/Profile/Me';
import Settings from './pages/Settings';
import Users from './pages/Users';
import UserEdit from './pages/Users/Edit';
import NoMatch from './pages/NoMatch';
import TermsOfService from "./pages/StaticPages/TermsOfService";
import PrivacyPolicy from "./pages/StaticPages/PrivacyPolicy";

const RestrictedRoute = ({component: Component, layout: Layout = LayoutDefault, authenticated, ...rest}) =>
  <Route
    {...rest}
    render={props => authenticated
      ? <Layout><Component {...props} /></Layout>
      : <Redirect
        to={{
          pathname: '/signin',
          state: {from: props.location}
        }}
      />
    }
  />;

const GuestRoute = ({component: Component, layout: Layout = LayoutGuest, ...rest}) =>
  <Route
    {...rest}
    render={props => <Layout><Component {...props} /></Layout>}
  />;

@inject('UIStore', 'AuthStore')
@observer
class Routes extends Component {

  componentDidMount() {
    const {authenticated, handleAuth} = this.props.AuthStore;
    window.addEventListener('resize', () => {
      this.props.UIStore.setWidth(Math.max(document.body.scrollWidth, window.innerWidth));
      this.props.UIStore.setHeight(Math.max(document.body.scrollHeight, window.innerHeight));
    });
    console.log(document.body.scrollHeight, Math.max(document.body.scrollHeight, window.innerHeight), window.innerHeight);
    if (authenticated === false) {
      handleAuth();
    } else {
      const location = this.props.location.pathname + this.props.location.search + this.props.location.hash;
      localStorage.setItem('location', location || '/dashboard');
    }
  }

  render() {
    const {authenticated} = this.props.AuthStore;
    if (!['/signin', '/signup', '/reset'].includes(this.props.location.pathname)) {
      localStorage.setItem('location', this.props.location.pathname + this.props.location.search + this.props.location.hash);
    }
    return (
      (authenticated === null) ? <Loader backgroud={true} height={this.props.UIStore.height}/>
        : <Switch>
          <GuestRoute exact path="/" component={Welcome} layout={LayoutWelcome}/>
          <GuestRoute exact path="/features" component={Features}/>
          <GuestRoute exact path="/tos" component={TermsOfService}/>
          <GuestRoute exact path="/privacy" component={PrivacyPolicy}/>
          <GuestRoute exact path="/signin" component={SignIn}/>
          <GuestRoute exact path="/signout" component={SignOut}/>
          <GuestRoute exact path="/signup" component={SignUp}/>
          <GuestRoute exact path="/reset" component={Reset}/>
          <GuestRoute exact path="/newpassword/:token" component={NewPassword}/>

          <RestrictedRoute exact path="/dashboard" component={Dashboard} authenticated={authenticated}/>
          <RestrictedRoute exact path="/profile" component={Me} authenticated={authenticated}/>
          <RestrictedRoute exact path="/settings/:page?" component={Settings} authenticated={authenticated}/>
          <RestrictedRoute exact path="/users/:id/edit" component={UserEdit} authenticated={authenticated}/>
          <RestrictedRoute exact path="/users/:page?/:id?" component={Users} authenticated={authenticated}/>

          <GuestRoute exact path="/:username" component={Profile} layout={LayoutDefault}/>
          <GuestRoute component={NoMatch}/>
        </Switch>
    )
  }
}

export default Routes;
