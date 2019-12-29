import React, {Component} from 'react';
import {Navbar, Footer} from '../components'

import '../styles/App.scss';

class Layout extends Component {
    render() {
        return (
            <React.Fragment>
                <Navbar/>
                <div className="page" data-spy="scroll" data-target="#navbar" data-offset="0">
                    {this.props.children}
                </div>
                <Footer/>
            </React.Fragment>
        );
    }
}
export default Layout;
