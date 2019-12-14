import {inject, observer} from 'mobx-react';
import {autorun} from 'mobx';
import React, {Component} from 'react';
import StorImage from 'components/Common/StorImage'

@inject('AuthStore', 'UserStore')
@observer
class Profile extends Component {
  constructor(props) {
    super(props);
    autorun(() => {
      this.props.UserStore.getUserByUsername(props.match.params.username || props.AuthStore.me.uid);
    })
  }

  render() {
    const user = this.props.UserStore.data;
    console.log({user});
    if (user === null) return <section className="container">
      <div className="profile">Loading...</div>
    </section>;
    if (!user) return <section className="container">
      <div className="profile"><h3>User not found!</h3>
        <p>{JSON.stringify(process.env)}</p></div>
    </section>;

    const isMe = this.props.AuthStore.me.uid === user.uid;
    console.log(isMe, this.props.AuthStore.me.uid,user.uid)
    return <section className="container">
      <div className="profile">
        <div className="fb-profile">
          {isMe && <button>Edit</button>}
          <StorImage align="left" className="fb-image-lg img-fluid"
                     width={1200}
                     height={300}
                     src={user.cover}
                     alt={user.fullname}/>
          <StorImage align="left" className="fb-image-profile img-thumbnail"
                     width={120}
                     height={120}
                     src={user.avatar}
                     alt={user.fullname}/>
          <div className="fb-profile-text">

            <p>{user.bio && user.bio}</p>
          </div>
        </div>
      </div>
    </section>

  }
}

// const mapStateToProps = (state) => {
//     return {me: state.auth.me, user: state.system.data}
// };
//
// const mapDispatchToProps = (dispatch) => {
//     return {
//         getProfile: (values) => {
//             dispatch(getProfile(values));
//         },
//     }
// };

export default Profile//connect(mapStateToProps, mapDispatchToProps)(Profile);
