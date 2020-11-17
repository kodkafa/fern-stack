import React from 'react'
import {Footer, Navbar} from './components'
import './assets/App.scss'
import 'bootstrap/dist/js/bootstrap.bundle.js'

export const LayoutWelcome = props => (
  <React.Fragment>
    <Navbar className="navbar-light" />
    <div className="page" data-target="#navbar" data-offset="0">
      {props.children}
    </div>
    <Footer />
  </React.Fragment>
)

export const LayoutGuest = props => (
  <React.Fragment>
    <Navbar className="navbar-shrinked navbar-light" />
    <div className="page" data-target="#navbar" data-offset="0">
      {props.children}
    </div>
    <Footer />
  </React.Fragment>
)

export const LayoutDefault = props => (
  <React.Fragment>
    <Navbar className="navbar-shrinked navbar-light" />
    <div className="page" data-target="#navbar" data-offset="0">
      {props.children}
    </div>
    <Footer />
  </React.Fragment>
)
