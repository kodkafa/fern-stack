import {inject, observer} from 'mobx-react'
import React, {Component} from 'react'
import {Link} from 'react-router-dom'

@inject('AuthStore', 'UserStore')
@observer
class User extends Component {
  getUserData(props) {
    const id = props.match.params.id
    this.props.UserStore.getUserById(id)
  }

  componentDidMount() {
    this.getUserData(this.props)
  }

  render() {
    const {isAdmin, isEditor} = this.props.AuthStore.me
    // if (!isEditor && !isAdmin) return History.push('/users');
    const user = this.props.UserStore.user // this.getUserData(this.props);
    if (!user) return <div className="profile">User not found!</div>
    return (
      <section className="container">
        <div className="profile">
          <div className="fb-profile">
            <img
              align="left"
              className="fb-image-lg img-fluid"
              onError={e => {
                e.target.onerror = null
                e.target.src = 'http://holder.ninja/1200x360,cover-1200x360.svg'
              }}
              src={user.photoURL}
              alt={user.name}
            />
            <img
              align="left"
              className="fb-image-profile img-thumbnail"
              onError={e => {
                e.target.onerror = null
                e.target.src = 'http://holder.ninja/180x180,profile.svg'
              }}
              src={user.photoURL}
              alt={user.name}
            />
            <div className="fb-profile-text">
              <h1>{user.name}</h1>
              <p>{user.email}</p>
              <p>{user.bio && user.bio}</p>
              {isAdmin && (
                <Link
                  to={'/users/' + user.id + '/edit'}
                  className="btn btn-sm btn-primary">
                  Edit
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    )
  }
}

// const mapStateToProps = (state) => {
//     return {me: state.auth.me}
// }

export default User //connect(mapStateToProps)(User);
