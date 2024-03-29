import React from 'react'
// import {inject, observer} from 'mobx-react'
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom'
// import {Loader} from './components'
import {LayoutDefault, LayoutGuest, LayoutWelcome} from 'layouts'
// import SignUp from './pages/Auth/SignUp'
import {
  Account,
  ChangePassword,
  Dashboard,
  Features,
  Info,
  Me,
  NoMatch,
  PrivacyPolicy,
  Reset,
  Settings,
  SignIn,
  SignOut,
  SignUp,
  TermsOfService,
  Username,
  Users,
  Welcome,
} from 'pages'

const RestrictedRoute = ({
  component: Component,
  layout: Layout = LayoutDefault,
  authenticated,
  children,
  ...rest
}) => {
  const location = useLocation()
  if (!['/signin', '/signup', '/reset'].includes(location.pathname)) {
    localStorage.setItem(
      'location',
      location.pathname + location.search + location.hash
    )
  }
  console.log('RestrictedRoute', authenticated)
  return authenticated ? (
    <Route
      {...rest}
      element={
        <Layout>
          <Component />
        </Layout>
      }>
      {children}
    </Route>
  ) : (
    <Navigate
      to={{
        pathname: '/signin',
        state: {from: rest.location},
      }}
    />
  )
}

const GuestRoute = ({
  component: Component,
  layout: Layout = LayoutGuest,
  ...rest
}) => (
  <Route
    {...rest}
    element={
      <Layout>
        <Component />
      </Layout>
    }
  />
)

export const Routing = props => {
  //const location = useLocation()

  // const {authenticated, handleAuth} = props.AuthStore
  // window.addEventListener('resize', () => {
  //   props.UIStore.setWidth(Math.max(document.body.scrollWidth, window.innerWidth))
  //   props.UIStore.setHeight(Math.max(document.body.scrollHeight, window.innerHeight))
  // })
  // console.log(document.body.scrollHeight, Math.max(document.body.scrollHeight, window.innerHeight), window.innerHeight)
  // if (authenticated === false) {
  //   handleAuth()
  // } else {
  //   //localStorage.setItem('location', (location.pathname + location.search + location.hash) || '/dashboard')
  // }
  //

  return (
    <Router>
      {/*<ScrollToTop/>*/}
      <Routes>
        {/*<Routes>*/}
        {/*<GuestRoute path="/" component={Welcome} layout={LayoutWelcome}/>*/}
        {/*<GuestRoute path="/features" component={Features}/>*/}
        {/*<GuestRoute path="/tos" component={TermsOfService}/>*/}
        {/*<GuestRoute path="/privacy" component={PrivacyPolicy}/>*/}
        {/*<GuestRoute path="/signin" component={SignIn}/>*/}
        {/*<GuestRoute path="/signout" component={SignOut}/>*/}
        {/*<GuestRoute path="/signup" component={SignUp}/>*/}
        {/*<GuestRoute path="/reset" component={Reset}/>*/}
        {/*<GuestRoute path="/newpassword/:token" component={NewPassword}/>*/}

        {/*<RestrictedRoute path="/dashboard" component={Dashboard} authenticated={authenticated}/>*/}
        {/*<RestrictedRoute path="/profile" component={Me} authenticated={authenticated}/>*/}
        {/*<RestrictedRoute path="/settings/:page?" component={Settings} authenticated={authenticated}/>*/}
        {/*<RestrictedRoute path="/users/:id/edit" component={UserEdit} authenticated={authenticated}/>*/}
        {/*<RestrictedRoute path="/users/:page?/:id?" component={Projects} authenticated={authenticated}/>*/}

        {/*<GuestRoute path="/:username" component={Profile} layout={LayoutDefault}/>*/}
        <GuestRoute path="" component={Welcome} layout={LayoutWelcome} />
        <GuestRoute
          path="privacy"
          component={PrivacyPolicy}
          layout={LayoutGuest}
        />
        <GuestRoute
          path="tos"
          component={TermsOfService}
          layout={LayoutGuest}
        />
        <GuestRoute path="features" component={Features} layout={LayoutGuest} />
        <GuestRoute path="signup" component={SignUp} layout={LayoutGuest} />
        <GuestRoute path="signin" component={SignIn} layout={LayoutGuest} />
        <GuestRoute path="signout" component={SignOut} layout={LayoutGuest} />
        <GuestRoute path="reset" component={Reset} layout={LayoutGuest} />
        <RestrictedRoute
          path="dashboard"
          component={Dashboard}
          authenticated={props.authenticated}
        />
        <RestrictedRoute
          path="info"
          component={Info}
          authenticated={props.authenticated}
        />
        <RestrictedRoute
          path="profile"
          component={Me}
          authenticated={props.authenticated}
        />
        <RestrictedRoute
          path="settings"
          component={Settings}
          authenticated={props.authenticated}>
          <Route path="/" element={<Account />} />
          <Route path="/set-username" element={<Username />} />
          <Route path="/change-password" element={<ChangePassword />} />
        </RestrictedRoute>
        <RestrictedRoute
          path="users/*"
          component={Users}
          authenticated={props.authenticated}
        />
        <Route path="*" element={<NoMatch />} />
      </Routes>
    </Router>
  )
}
