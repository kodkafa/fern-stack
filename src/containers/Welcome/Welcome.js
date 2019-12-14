import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {HashLink} from 'react-router-hash-link';

class Welcome extends Component {
  render() {
    return <React.Fragment>
      <header className="intro">
        <div className="container">
          <div className="intro-text">
            <h2 className="intro-lead-in">Welcome,</h2>
            <h1 className="intro-heading text-uppercase">The FullStack <br/>React +(Mobx)+ Firebase <br/><span
              className="highlight">Boilerplate</span></h1>
            <HashLink className="btn btn-primary btn-xl text-uppercase" to="#about">Tell Me More</HashLink>
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
