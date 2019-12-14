import {inject, observer} from "mobx-react";
import React, {Component} from 'react';

@inject('AuthStore', 'UserStore')
@observer
class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    //if (!this.props.authenticated)
    //History.push('/signin');
  }

  test = () => {
    console.log(this.props.AuthStore.me);
    this.props.AuthStore.test()
  };
  toggleAdmin = () => {
    console.log(this.props.me);
    this.props.UserStore.toggleAdmin({
      email: 'goker@basepart.com'
    })
  };

  static renderHello(user) {
    if (user) {
      return <p>Hello <strong> {user} </strong>, you logged in!</p>
    }
  }

  render() {
    return <React.Fragment>
      <section className="container">
        <h1 className="h2">Home</h1>
        {this.props.me && Home.renderHello(this.props.me.name)}
        <p>This is a static page and you must be logged in to see the page.</p>

        <button onClick={this.test}>test</button>
        <br/>
        <button onClick={this.toggleAdmin}>Toggle admin to goker@basepart.com</button>
      </section>
    </React.Fragment>;
  }
}

export default Home
