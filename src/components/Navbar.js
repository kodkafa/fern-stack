import {inject, observer} from "mobx-react";
import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {HashLink} from 'react-router-hash-link';
import {SystemMessages} from './SystemMessages';
import logo from '../assets/img/logo.svg';
import {computed} from "mobx";
import {ImageViewer} from './ImageViewer'


@inject('AuthStore')
@observer
class Navbar extends Component {

  @computed get authenticated() {
    return this.props.AuthStore.authenticated
  }

  @computed get me() {
    return this.props.AuthStore.me
  }

  get isShrink() {
    return this.props.className.indexOf('navbar-shrinked') > -1
  }

  static dropDownToggle(e) {
    const dd = e.currentTarget;
    dd.classList.toggle('show');
    dd.querySelector('.dropdown-menu').classList.toggle('show');
  }

  static Shrink(e, shrink) {
    const navbar = document.getElementById('navbar');
    if (shrink || window.pageYOffset > 0) {
      navbar.classList.add("navbar-shrink");
    } else {
      navbar.classList.remove("navbar-shrink");
    }
  }

  componentDidMount() {
    if (!this.isShrink) {
      Navbar.Shrink(null, !!this.me.uid);
      window.addEventListener('scroll', Navbar.Shrink);
    }
    // else
    //   window.removeEventListener('scroll', Navbar.Shrink);
  }

  //
  // componentDidUpdate(props) {
  //   Navbar.Shrink(null, this.authenticated);
  //   if (this.authenticated)
  //     window.removeEventListener('scroll', Navbar.Shrink);
  //   else
  //     window.addEventListener('scroll', Navbar.Shrink);
  // }


  renderLogo() {
    return <Link to={this.me.uid ? "/home" : "/"} className="navbar-brand" key="logo">
      <img id="logo" src={logo} className="img-fluid" alt="logo"/>
    </Link>
  }
  renderLinks() {
    const {authenticated, me} = this;
    console.log('me', me, me.isWorker());
    if (authenticated) {
      return <React.Fragment>
        {me.isWorker() &&
        <li className="nav-item">
          <Link className="nav-link" to="/works">Works</Link>
        </li>}
        {(me.isManager() || me.isAdmin()) &&
        <li className="nav-item">
          <Link className="nav-link" to="/users">Users</Link>
        </li>}
      </React.Fragment>
    } else {
      return [<li className="nav-item" key="about">
        <HashLink smooth className="nav-link" to="/#about">About</HashLink>
      </li>,
        <li className="nav-item" key="features">
          <Link className="nav-link" to="/features">Features</Link>
        </li>];
    }
  }

  renderUserMenu() {
    const {authenticated, me} = this;
    if (authenticated) {
      return [
        <li className="nav-item dropdown" key="userMenu" onClick={Navbar.dropDownToggle}>
          <span className="nav-link dropdown-toggle" data-toggle="dropdown">
            <ImageViewer className="navbar-avatar"
                         src={me.avatar} alt={me.name}/>
            <i className={me.icon}/> <strong>{me.first}</strong>
          </span>
          <div className="dropdown-menu">
            <Link className="dropdown-item" to="/dashboard">Dashboard</Link>
            <Link className="dropdown-item" to="/profile">Profile</Link>
            <Link className="dropdown-item" to="/settings">Settings</Link>
            <div className="dropdown-divider"/>
            <Link className="dropdown-item" to="/signout">Log out</Link>
          </div>
        </li>
      ];
    } else {
      return [
        <li className="nav-item" key="signin">
          <Link className="nav-link" to="/signin">Sign In</Link>
        </li>,
        <li className="nav-item" key="signup">
          <Link className="nav-link" to="/signup">Sign Up</Link>
        </li>
      ];
    }
  }

  render() {
    return (
      <nav id="navbar" className={"navbar navbar-expand-lg fixed-top " + this.props.className}>
        <div className="container">
          {this.renderLogo()}
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarMain"
                  aria-controls="navbarMain" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"/>
          </button>

          <div className="collapse navbar-collapse" id="navbarMain">
            <ul className="navbar-nav mr-auto">
              {this.renderLinks()}
            </ul>

            <ul className="nav navbar-nav navbar-right">
              {this.renderUserMenu()}
            </ul>
          </div>
        </div>
        <SystemMessages/>
      </nav>
    );
  }
}

export default Navbar
