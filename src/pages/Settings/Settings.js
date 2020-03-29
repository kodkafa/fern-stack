import React, {PureComponent} from 'react';
import {Link, Route} from 'react-router-dom';
import Account from './Account';
import ChangePassword from './ChangePassword';
import Username from './Username';

const routes = [
  {
    path: '/settings(/account)?',
    link: '/settings/account',
    icon: 'fa fa-user',
    exact: true,
    title: () => <h1 className="h5">Account Info</h1>,
    name: 'Account Info',
    main: Account
  },
  // {
  //   path: '/settings/images',
  //   link: '/settings/images',
  //   icon: 'fa fa-image',
  //   exact: true,
  //   title: () => <h1 className="h5">Change Images</h1>,
  //   name: 'Change Images',
  //   main: Images
  // },
  {
    path: '/settings/set-username',
    link: '/settings/set-username',
    icon: 'fa fa-key',
    exact: true,
    title: () => <h1 className="h5">Set Username</h1>,
    name: 'Set Username',
    main: Username
  },
  {
    path: '/settings/change-password',
    link: '/settings/change-password',
    icon: 'fa fa-key',
    exact: true,
    title: () => <h1 className="h5">Change Password</h1>,
    name: 'Change Password',
    main: ChangePassword
  },
];

class Settings extends PureComponent {

  render() {
    return <section className="container">
      <div className="row">
        <nav className="col-md-2 d-none d-md-block border-right sidebar">
          <div className="sidebar-sticky">
            <h5 className="sidebar-heading text-muted"><i className="fa fa-cogs"/> Settings</h5>
            <ul className="nav flex-column small">
              {routes.map((route, index) => (
                <li key={index} className="nav-item">
                  <Link className="nav-link active" to={route.link}>
                    <i className={route.icon}/> {route.name}
                  </Link>
                </li>))}
            </ul>
          </div>
        </nav>
        <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-4">
          <div
            className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            {routes.map((route, index) => (
              <Route
                key={index}
                path={route.path}
                exact={route.exact}
                component={route.title}
              />
            ))}
          </div>
          {routes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              exact={route.exact}
              component={route.main}
            />
          ))}
        </main>
      </div>
    </section>;
  }
}

export default Settings;
