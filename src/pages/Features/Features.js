import React, {Component} from 'react';

class Features extends Component {
  render() {
    return <section id="features">
      <div className="container">
        <h1 className="h3">Features</h1>

        <table className="table table-bordered">
          <tr>
            <th width="50%">Feature</th>
            <th className="text-center" width="25%">DONE</th>
            <th className="text-center" width="25%">IN PROGRESS</th>
          </tr>
          <tr>
            <td>
              User Register/Login
              <div className="small text-muted">Users can register and login with their email.</div>
            </td>
            <td className="text-center"><i className="fas fa-check"/></td>
            <td className="text-center"/>
          </tr>
          <tr>
            <td>Password Recovery</td>
            <td className="text-center"/>
            <td className="text-center"><i className="fas fa-check"/></td>
          </tr>
          <tr>
            <td>
              User Access Control
              <div className="small text-muted">Five level access control with Firebase custom claims.</div>
            </td>
            <td className="text-center"><i className="fas fa-check"/></td>
            <td className="text-center"/>
          </tr>
          <tr>
            <td>
              Unique Username
              <div className="small text-muted">Users set their unique username.</div>
            </td>
            <td className="text-center"><i className="fas fa-check"/></td>
            <td className="text-center"/>
          </tr>
          <tr>
            <td>
              User Profile
              <div className="small text-muted">Users have a simple profile page with avatar and cover images.</div>
            </td>
            <td className="text-center"><i className="fas fa-check"/></td>
            <td className="text-center"/>
          </tr>
          <tr>
            <td>
              Image Upload (Fire Storage)
              <div className="small text-muted">Users can upload and edit their avatar and cover images.</div>
            </td>
            <td className="text-center"><i className="fas fa-check"/></td>
            <td className="text-center"/>
          </tr>
          <tr>
            <td>
              User List
              <div className="small text-muted">Granted users can see user list and search in.</div>
            </td>
            <td className="text-center"><i className="fas fa-check"/></td>
            <td className="text-center"/>
          </tr>
          <tr>
            <td>User Management (Access Level Control)
              <div className="small text-muted">Granted users can change any user access level.</div>
            </td>
            <td className="text-center"><i className="fas fa-check"/></td>
            <td className="text-center"/>
          </tr>
          <tr>
            <td>
              Activity Log
              <div className="small text-muted">All users activity will be logged.</div>
            </td>
            <td className="text-center"/>
            <td className="text-center"><i className="fas fa-check"/></td>
          </tr>
        </table>

        <h2 className="h3">Packages</h2>
        <p>React 16.4, Firebase 7.6, Mobx 5.15, Bootstrap 4.4 (Reactstrap), React Router 5.1, Formik 2.0</p>
      </div>
    </section>;
  }
}

export default Features;
