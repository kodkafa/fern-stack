import {inject, observer} from 'mobx-react'
import {autorun} from 'mobx'
import React from 'react'
import {Avatar, ImageViewer} from '../../components'
import {Link} from 'react-router-dom'

export const Profile = inject('AuthStore')(
  observer(props => {
    autorun(() => {
      props.UserStore.getUserByUsername(props.match.params.username)
    })

    const user = this.props.UserStore.data
    if (user === null)
      return (
        <section className="container">
          <div className="profile">Loading...</div>
        </section>
      )
    if (!user)
      return (
        <section className="container">
          <div className="profile">
            <h3>User not found!</h3>
          </div>
        </section>
      )

    return (
      <section className="container py-5">
        <div className="profile">
          <figure id="cover-figure" className="cover">
            <ImageViewer
              className="img-fluid"
              width={1200}
              height={300}
              src={user.cover}
              alt={user.name}
            />
            <figure className="avatar">
              <Avatar
                className="img-thumbnail"
                width={120}
                height={120}
                src={user.avatar}
                alt={user.name}
              />
            </figure>
            <div className="info">
              <h1 className="h2">{user.name}</h1>
              <h2 className="h6">{user.username}</h2>
            </div>
          </figure>
          <div className="profile-nav">
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
              <ul className="navbar-nav">
                <li className="nav-item active">
                  <Link className="nav-link" to="/">
                    Home <span className="sr-only">(current)</span>
                  </Link>
                </li>
                {/*<li className="nav-item">*/}
                {/*  <a className="nav-link" href="#">Features</a>*/}
                {/*</li>*/}
                {/*<li className="nav-item">*/}
                {/*  <a className="nav-link" href="#">Pricing</a>*/}
                {/*</li>*/}
                {/*<li className="nav-item">*/}
                {/*  <a className="nav-link disabled" href="#" tabIndex="-1" aria-disabled="true">Disabled</a>*/}
                {/*</li>*/}
              </ul>
            </nav>
          </div>
          <p>{user.bio && user.bio}</p>
        </div>
      </section>
    )
  })
)
