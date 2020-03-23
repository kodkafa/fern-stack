import React from 'react';
import {Footer, Navbar} from './components'

import './assets/App.scss';

export const LayoutWelcome = (props) =>
  <React.Fragment>
    <Navbar className="navbar-light"/>
    <div className="page" data-spy="scroll" data-target="#navbar" data-offset="0">
      {props.children}
    </div>
    <Footer/>
  </React.Fragment>;

export const LayoutGuest = (props) =>
  <React.Fragment>
    <Navbar className="navbar-shrinked navbar-light"/>
    <div className="page" data-spy="scroll" data-target="#navbar" data-offset="0">
      {props.children}
    </div>
    <Footer/>
  </React.Fragment>;

export const LayoutDefault = (props) =>
  <React.Fragment>
    <Navbar className="navbar-shrinked navbar-light"/>
    <div className="page" data-spy="scroll" data-target="#navbar" data-offset="0">
      {props.children}
    </div>
    <Footer/>
  </React.Fragment>;

