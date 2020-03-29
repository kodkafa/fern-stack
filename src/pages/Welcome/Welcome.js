import {inject, observer} from "mobx-react";
import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {HashLink} from 'react-router-hash-link';

@inject('UIStore')
@observer
class Welcome extends Component {
  render() {
    const {height} = this.props.UIStore;
    return <React.Fragment>
      <header id="intro" className="intro" style={{height}}>
        <div className="container">
          <div className="intro-text">
            <h2 className="intro-lead-in">Welcome,</h2>
            <h1 className="intro-heading text-uppercase">The FullStack <br/>React +(Mobx)+ Firebase <br/><span
              className="highlight">Boilerplate</span></h1>
            <HashLink smooth className="btn btn-outline-primary btn-xl text-uppercase text-white" to="/#about">Tell Me More</HashLink>
            <div id="backgroundBadge">
              <a
                href="https://unsplash.com/@otenteko?utm_medium=referral&amp;utm_campaign=photographer-credit&amp;utm_content=creditBadge"
                target="_blank" rel="noopener noreferrer"
                title="Download free do whatever you want high-resolution photos from Anas Alshanti">
                <span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><title>unsplash-logo</title><path
                  d="M10 9V0h12v9H10zm12 5h10v18H0V14h10v9h12v-9z"/></svg>
                 </span>
                <span>Anas Alshanti</span></a>
            </div>
          </div>
        </div>
      </header>
      <section id="about" className="container">
        <div className="row justify-content-center">
          <div className="col-md-4">
          </div>
          <div className="col-md-8">
            <h2 className="section-heading">ABOUT</h2>
            <h3 className="section-subheading text-muted mb-4">This is a default static page and no need
              authentication.</h3>
            <p>
              Hi, I'm Goker.</p>
            <p>
              This is an open source full-stack React + Mobx (boilerplate) application with Firebase (Cloud Firestore,
              Cloud Functions and Storage).
            </p>
            <p>
              I developing this project for rapid application development for my side projects and the <a
              href="https://kodkafa.com/" target="_blank" rel="noopener noreferrer">kodkafa</a> which is developed with
              this project, is one of
              them.
            </p>
            <p>
              Also, you can visit <Link to="/features">Features</Link> to see full features list. If you want to
              contribute you can reach me freely via <a href="https://goker.me"
                                                        rel="noopener noreferrer"
                                                        target="_blank">goker.me</a>
            </p>
          </div>
        </div>
      </section>
    </React.Fragment>;
  }
}

export default Welcome;
