import React from 'react'
import packageJSON from '../../../package.json'

export const Features = () => {
  return (
    <section id="features">
      <div className="container">
        <div className="row">
          <div className="col-7">
            <h1 className="h3">Features</h1>

            <table className="table table-bordered small">
              <thead>
                <tr>
                  <th>Feature</th>
                  <th className="text-center" width="20%">
                    DONE
                  </th>
                  <th className="text-center" width="20%">
                    IN PROGRESS
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    User Register/Login
                    <div className="small text-muted">
                      Users can register and login with their email.
                    </div>
                  </td>
                  <td className="text-center">
                    <i className="fas fa-check" />
                  </td>
                  <td className="text-center" />
                </tr>
                <tr>
                  <td>
                    Password Recovery
                    <div className="small text-muted">
                      Users can recover with Firebase.
                    </div>
                  </td>
                  <td className="text-center">
                    <i className="fas fa-check" />
                  </td>
                  <td className="text-center" />
                </tr>
                <tr>
                  <td>
                    Password Recovery (Customize)
                    <div className="small text-muted">
                      Users can set new password on the website.
                    </div>
                  </td>
                  <td className="text-center" />
                  <td className="text-center">
                    <i className="fas fa-check" />
                  </td>
                </tr>
                <tr>
                  <td>
                    User Access Control
                    <div className="small text-muted">
                      Five level access control with Firebase custom claims.
                    </div>
                  </td>
                  <td className="text-center">
                    <i className="fas fa-check" />
                  </td>
                  <td className="text-center" />
                </tr>
                <tr>
                  <td>
                    Unique Username
                    <div className="small text-muted">
                      Users set their unique username.
                    </div>
                  </td>
                  <td className="text-center">
                    <i className="fas fa-check" />
                  </td>
                  <td className="text-center" />
                </tr>
                <tr>
                  <td>
                    User Profile
                    <div className="small text-muted">
                      Users have a simple profile page with avatar and cover
                      images.
                    </div>
                  </td>
                  <td className="text-center">
                    <i className="fas fa-check" />
                  </td>
                  <td className="text-center" />
                </tr>
                <tr>
                  <td>
                    Image Upload (Fire Storage)
                    <div className="small text-muted">
                      Users can upload and edit their avatar and cover images.
                    </div>
                  </td>
                  <td className="text-center">
                    <i className="fas fa-check" />
                  </td>
                  <td className="text-center" />
                </tr>
                <tr>
                  <td>
                    User List
                    <div className="small text-muted">
                      Granted users can see user list and search in.
                    </div>
                  </td>
                  <td className="text-center">
                    <i className="fas fa-check" />
                  </td>
                  <td className="text-center" />
                </tr>
                <tr>
                  <td>
                    User Management (Access Level Control)
                    <div className="small text-muted">
                      Granted users can change any user access level.
                    </div>
                  </td>
                  <td className="text-center">
                    <i className="fas fa-check" />
                  </td>
                  <td className="text-center" />
                </tr>
                <tr>
                  <td>
                    Dashboard Layout
                    <div className="small text-muted">
                      Dashboard layout for logged users.
                    </div>
                  </td>
                  <td className="text-center">
                    <i className="fas fa-check" />
                  </td>
                  <td className="text-center" />
                </tr>
                <tr>
                  <td>
                    Activity Log
                    <div className="small text-muted">
                      All users activity will be logged.
                    </div>
                  </td>
                  <td className="text-center" />
                  <td className="text-center">
                    <i className="fas fa-check" />
                  </td>
                </tr>
                <tr>
                  <td>
                    Version Control
                    <div className="small text-muted">
                      Show version number in package.json and manage with custom
                      yarn commands.
                    </div>
                  </td>
                  <td className="text-center">
                    <i className="fas fa-check" />
                  </td>
                  <td className="text-center" />
                </tr>
                <tr>
                  <td>
                    PWA
                    <div className="small text-muted">
                      Progressive Web App and new version alert.
                    </div>
                  </td>
                  <td className="text-center">
                    <i className="fas fa-check" />
                  </td>
                  <td className="text-center" />
                </tr>
                <tr>
                  <td>
                    Multilingual
                    <div className="small text-muted">
                      i18next internationalization
                    </div>
                  </td>
                  <td className="text-center">
                    <i className="fas fa-check" />
                  </td>
                  <td className="text-center" />
                </tr>
                <tr>
                  <td>
                    Form Validation
                    <div className="small text-muted">
                      Schema based value parsing and validation
                    </div>
                  </td>
                  <td className="text-center">
                    <i className="fas fa-check" />
                  </td>
                  <td className="text-center" />
                </tr>
              </tbody>
            </table>
          </div>
          <div className="col-5">
            <h2 className="h3">Packages</h2>
            <table className="table table-bordered small">
              <thead>
                <tr>
                  <th width="50%">Dependencies</th>
                  <th className="text-center" width="25%">
                    Version
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(packageJSON.dependencies).map(([p, v]) => (
                  <tr key={'package-' + p}>
                    <td>{p}</td>
                    <td className="text-center">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <table className="table table-bordered small">
              <thead>
                <tr>
                  <th width="50%">Dev Dependencies</th>
                  <th className="text-center" width="25%">
                    Version
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(packageJSON.devDependencies).map(([p, v]) => (
                  <tr key={'package-' + p}>
                    <td>{p}</td>
                    <td className="text-center">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}
