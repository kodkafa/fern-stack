import {inject, observer} from 'mobx-react';
import {autorun} from 'mobx';
import React, {Component} from 'react';
import {ImageViewer} from '../../components';
import {Button, Modal, ModalBody, ModalFooter} from "reactstrap";
import AvatarEditor from "react-avatar-editor";
import {Link} from 'react-router-dom';

@inject('AuthStore', 'UserStore')
@observer
class Profile extends Component {
  constructor(props) {
    super(props);
    autorun(() => {
      this.props.UserStore.getUserByUsername(props.match.params.username || props.AuthStore.me.uid);
    });
    this.state = {
      width: 1200,
      height: 300,
      selectedFile: '',
      isUploadingCover: false,
      isUploadingProfile: false,
      avatarModal: false,
      scale: 1.2,
      cover: null,
      avatar: null
    };
  }

  static handleBrowseFile(e) {
    e.stopPropagation();
    document.getElementById(e.currentTarget.dataset.input).click();
  }

  handleFileChange = (e) => {
    if (e.target.id === 'avatar') {
      this.setState({image: e.target.files[0], avatarModal: true});
    }
    if (e.target.id === 'cover') {
      const width = document.getElementById('cover-figure').offsetWidth;
      const height = width * .25;
      this.setState({cover: e.target.files[0], width, height});
    }
  };

  toggleAvatarModal = () => {
    this.setState({'avatarModal': !this.state.avatarModal})
  };

  setEditorRef = (editor) => this.editor = editor;

  handleScaleChange = (e) => {
    this.setState({scale: e.target.value})
  };

  uploadAvatar = async () => {
    if (this.editor) {
      const canvas = this.editor.getImageScaledToCanvas().toDataURL();
      const image = await fetch(canvas)
        .then(res => res.blob());
      this.props.UserStore.uploadAvatar(image, () => {
      }, () => {
      }, () => {
        this.toggleAvatarModal()
      });
    }
  };

  uploadCover = async () => {
    if (this.editor) {
      //const dataURL = this.editor.getImage().toDataURL();
      const dataURL = this.editor.getImageScaledToCanvas().toDataURL();
      const canvas = document.createElement("canvas");
      canvas.width = this.state.width;
      canvas.height = this.state.height;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.onload = async () => {
        ctx.drawImage(img, 0, 0);
        const image = await fetch(canvas.toDataURL())
          .then(res => res.blob());
        this.props.UserStore.uploadCover(image, (progress) => {
          document.getElementById('coverProgress').style.width = progress + '%';
        }, () => null, () => {
          this.setState({cover: null});
          document.getElementById('coverProgress').style.width = 0;
        });
      };
      img.src = dataURL;
    }
  };

  cancelCover = () => {
    this.setState({cover: null})
  };

  render() {
    const user = this.props.AuthStore.me;
    if (user === null) return <section className="container">
      <div className="profile">Loading...</div>
    </section>;
    if (!user) return <section className="container">
      <div className="profile"><h3>User not found!</h3>
        <p>{JSON.stringify(process.env)}</p></div>
    </section>;

    return <section className="container py-5">
      <div className="profile">
        <figure id="cover-figure" className="cover">
          <div id="coverProgress" className="progress"/>
          <div className="buttons">
            <Link className="btn btn-primary" to="/settings">Edit Profile</Link>
            <button className="btn btn-primary ml-1"
                    data-input="cover"
                    onClick={!this.state.cover ? Profile.handleBrowseFile : () => null}>Change Cover
            </button>
          </div>
          <ImageViewer className="img-fluid"
                       width={this.state.width}
                       height={this.state.height}
                       src={user.cover}
                       alt={user.fullname}/>
          {this.state.cover
            ? <div className="editor">
              <AvatarEditor
                ref={this.setEditorRef}
                image={this.state.cover}
                width={this.state.width}
                height={this.state.height}
                border={0}
                scale={1}/>
              <div className="buttons">
                <button className="btn btn-primary" onClick={this.uploadCover}>Save</button>
                <button className="btn btn-danger ml-1" onClick={this.cancelCover}>Cancel</button>
              </div>
            </div>
            : <div className="image-input-container">
              <input type="file" id="cover" name="image" onChange={this.handleFileChange}/>
            </div>
          }
          <figure className={this.state.isUploadingProfile ? 'avatar uploading' : 'avatar'}>
            <ImageViewer className="img-thumbnail"
                         width={120}
                         height={120}
                         src={user.avatar}
                         alt={user.fullname}/>
            <div className="image-input-container">
              <input type="file" id="avatar" name="image" onChange={this.handleFileChange}/>
            </div>
            <button className="primary"
                    data-input="avatar"
                    onClick={Profile.handleBrowseFile}>Upload
            </button>
          </figure>
          <div className="info">
            <h1 className="h2">{user.name}</h1>
            <h2 className="h6">{user.username}</h2>
          </div>
        </figure>
        <div className="profile-nav">
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <ul className="navbar-nav">
              <li className="nav-item active">
                <Link className="nav-link" to="/">Home <span className="sr-only">(current)</span></Link>
              </li>
              {/*<li className="nav-item">*/}
              {/*  <a className="nav-link" href="#">Features</a>*/}
              {/*</li>*/}
              {/*<li className="nav-item">*/}
              {/*  <a className="nav-link" href="#">Pricing</a>*/}
              {/*</li>*/}
              {/*<li className="nav-item">*/}
              {/*  <a className="nav-link disabled" href="#" tabIndex="-1" aria-disabled="true">Disabled</a>*/}
              {/*</li>*/}
            </ul>
          </nav>
        </div>
        <p>{user.bio && user.bio}</p>
      </div>
      <Modal isOpen={this.state.avatarModal} toggle={this.toggleAvatarModal} className="">
        <ModalBody>
          <div className="d-flex justify-content-center">
            <AvatarEditor
              ref={this.setEditorRef}
              image={this.state.image}
              width={250}
              height={250}
              border={50}
              scale={this.state.scale}
            />
          </div>
          <input className="form-control" type="range" onChange={this.handleScaleChange} min="1" max="1.5" step=".05"
                 value={this.state.scale}/>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.uploadAvatar}>Upload</Button>{' '}
          <Button color="secondary" onClick={this.toggleAvatarModal}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </section>

  }
}

export default Profile;
