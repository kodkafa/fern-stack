import {inject, observer} from "mobx-react";
import React, {PureComponent} from 'react';

@inject('AuthStore')
@observer
class SignOut extends PureComponent {
  render() {
    this.props.AuthStore.signOut();
    return <section className="container">Sorry to see you go ...</section>;
  }
}

export default SignOut//connect(null, {userSignOut})(SignOut);
