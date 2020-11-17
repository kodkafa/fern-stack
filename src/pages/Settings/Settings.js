import React from 'react'
import {NavLink, Outlet} from 'react-router-dom'
import {useTranslation} from 'react-i18next'
// import ChangePassword from './ChangePassword';
// import Username from './Username';
//
// const routes = [
//   {
//     path: '/settings(/account)?',
//     link: '/settings/account',
//     icon: 'fa fa-user',
//     title: <h1 className="h5">Account Info</h1>,
//     name: 'Account Info',
//     main: <Account/>
//   },
//   // {
//   //   path: '/settings/images',
//   //   link: '/settings/images',
//   //   icon: 'fa fa-image',
//   //   exact: true,
//   //   title: <h1 className="h5">Change Images</h1>,
//   //   name: 'Change Images',
//   //   main: Images
//   // },
//   {
//     path: '/settings/set-username',
//     link: '/settings/set-username',
//     icon: 'fa fa-key',
//     exact: true,
//     title: <h1 className="h5">Set Username</h1>,
//     name: 'Set Username',
//     main: <Account/>
//     // main: Username
//   },
//   {
//     path: '/settings/change-password',
//     link: '/settings/change-password',
//     icon: 'fa fa-key',
//     exact: true,
//     title: <h1 className="h5">Change Password</h1>,
//     name: 'Change Password',
//     main: <Account/>
//     // main: ChangePassword
//   },
// ];

export const Settings = props => {
  const {t} = useTranslation()
  return (
    <section className="container">
      <div className="row">
        <div className="col-md-2 d-none d-md-block border-right sidebar">
          <div className="sidebar-sticky">
            <h5 className="sidebar-heading text-muted">
              <i className="fa fa-cogs" /> Settings
            </h5>
            <nav className="nav flex-column small">
              {/*{routes.map((route, index) => (*/}
              {/*  <li key={index} className="nav-item">*/}
              {/*    <Link className="nav-link active" to={route.link}>*/}
              {/*      <i className={route.icon}/> {route.name}*/}
              {/*    </Link>*/}
              {/*  </li>))}*/}
              {/*<li key="account" className="nav-item">*/}
              <NavLink className="nav-link" to="/settings" end={true}>
                <i className="fa fa-user" /> {t('Account')}
              </NavLink>
              {/*</li>*/}
              {/*<li key="username" className="nav-item">*/}
              <NavLink className="nav-link" to="/settings/set-username">
                <i className="fa fa-tag" /> {t('Set Username')}
              </NavLink>
              {/*</li>*/}
              {/*<li key="change-password" className="nav-item">*/}
              <NavLink className="nav-link" to="/settings/change-password">
                <i className="fa fa-key" /> {t('Change Password')}
              </NavLink>
              {/*</li>*/}
            </nav>
          </div>
        </div>
        <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-4">
          <Outlet />
          {/*<div*/}
          {/*  className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">*/}
          {/*  {routes.map((route, index) => (*/}
          {/*    <Route*/}
          {/*      key={index}*/}
          {/*      path={route.path}*/}
          {/*      element={route.title}*/}
          {/*    />*/}
          {/*  ))}*/}
          {/*</div>*/}
          {/*<Routes>*/}
          {/*  {routes.map((route, index) => (*/}
          {/*    <Route*/}
          {/*      key={index}*/}
          {/*      path={route.path}*/}
          {/*      element={route.main}*/}
          {/*    />*/}
          {/*  ))}*/}
          {/*</Routes>*/}
        </main>
      </div>
    </section>
  )
}
