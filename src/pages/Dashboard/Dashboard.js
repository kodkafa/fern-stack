import {inject, observer} from "mobx-react";
import React, {Component} from 'react';

@inject('AuthStore', 'UserStore')
@observer
class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }


  static renderHello(user) {
    if (user) {
      return <p>Hello <strong> {user} </strong>, you logged in!</p>
    }
  }

  render() {
    return <React.Fragment>
      <section className="container">
        <h1 className="h2">Dashboard</h1>
        <div className="d-flex pb-3 mb-3" style={{minHeight: 300}}>
          <div className="mr-3"  style={{maxWidth: 300}}>
            <div className="mb-3 p-2 card h-50">
              01
              {this.props.me && Dashboard.renderHello(this.props.me.name)}
              <p>This is a static page and you must be logged in to see the page.</p>
            </div>
            <div className="mb-3 p-2 card h-50">02</div>
          </div>
          <div className="flex-grow-1">
            <div className="d-flex mb-3 h-25">
              <div className="card flex-fill p-2 mr-3">03</div>
              <div className="card flex-fill p-2 mr-3">04</div>
              <div className="card flex-fill p-2">05</div>
            </div>
            <div className="mb-3 p-2 card h-75">06</div>
          </div>
        </div>
        <div className="d-flex mb-3">
          <div className="card flex-fill mr-3 p-2">07</div>
          <div className="card flex-fill mr-3 p-2">08</div>
          <div className="card flex-fill p-2">09</div>
        </div>
        <div className="d-flex mb-3">
          <div className="card flex-fill p-2">10</div>
        </div>
      </section>
    </React.Fragment>
      ;
  }
}

export default Dashboard
