import React, {Component} from 'react';
import {inject, observer} from "mobx-react";
import {Button, Modal, ModalBody, ModalFooter} from 'reactstrap';
import AvatarEditor from 'react-avatar-editor'

@inject('AuthStore', 'UserStore')
@observer
class Images extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 1200,
      height: 300,
      me: props.AuthStore.me,
      selectedFile: '',
      isUploading: false,
      isUploadingCover: false,
      isUploadingProfile: false,
      avatarModal: false,
      scale: 1.2,
      cover: null,
      avatar: null
    };
    // this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
  }

  componentDidUpdate(props) {
    if (this.props.me !== props.me)
      this.setState({
        me: props.me,
        isDone: true,
        isUploadingCover: false,
        isUploadingProfile: false,
      })
  }

  static handleBrowseFile(e) {
    e.stopPropagation();
    document.getElementById(e.currentTarget.dataset.input).click();
  }

  handleFileChange(e) {
    //this.handleImageUpload(e.target.id, e.target.files[0])
    console.log({e});
    if (e.target.id === 'avatar') {
      this.setState({image: e.target.files[0], avatarModal: true});
    }
    if (e.target.id === 'cover') {
      console.log('cover');
      const width = document.getElementById('cover-figure').offsetWidth;
      const height = width * .25;
      this.setState({cover: e.target.files[0], width, height});
    }
  }

  toggleAvatarModal = () => {
    this.setState({'avatarModal': !this.state.avatarModal})
  };

  setEditorRef = (editor) => this.editor = editor;

  handleScaleChange = (e) => {
    console.log('handleScaleChange', e.target.value);
    this.setState({scale: e.target.value})
    //this.editor.scale = e.val();
  };

  uploadAvatar = async () => {
    if (this.editor) {

      // const canvas = this.editor.getImage().toDataURL();
      // const image = await fetch(canvas)
      //   .then(res => res.blob());

      const canvas = this.editor.getImageScaledToCanvas().toDataURL();
      const image = await fetch(canvas)
        .then(res => res.blob());

      this.props.UserStore.uploadAvatar(image, () => {
      }, () => {
      }, () => {
        this.toggleAvatarModal()
      });
      console.log({image});
    }
  };

  uploadCover = async () => {
    if (this.editor) {
      const dataURL = this.editor.getImage().toDataURL();
      const canvas = document.createElement("canvas");
      canvas.width = 1200;
      canvas.height = 300;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.onload = async () => {
        ctx.drawImage(img, 0, 0);
        const image = await fetch(canvas.toDataURL())
          .then(res => res.blob());
        this.props.UserStore.uploadCover(image);
      };
      img.src = dataURL;
    }
  };


  render() {
    const me = this.props.AuthStore.me;
    return <div>

      <figure id="cover-figure" className={this.state.isUploadingCover ? 'CoverImage uploading' : 'CoverImage'}
              data-input="cover"
              onClick={!this.state.cover ? Images.handleBrowseFile : () => null}>
        <span className="loader"><i className="fa fa-spinner fa-spin fa-3x"/></span>
        {me.cover && me.cover.normal &&
        <img src={me.cover.normal} alt={me.name}/>
        }

        {this.state.cover
          ? <>
            <AvatarEditor
              ref={this.setEditorRef}
              image={this.state.cover}
              width={this.state.width}
              height={this.state.height}
              border={0}
              scale={this.state.scale}/>

            <Button color="primary" onClick={this.uploadCover}>Save</Button>
            <Button color="danger" onClick={this.cancelCover}>Cancel</Button>
          </>
          : <div className="image-input-container"><input type="file" id="cover" name="image"
                                                          onChange={this.handleFileChange}/></div>
        }

        <figure className={this.state.isUploadingProfile ? 'ProfileImage uploading' : 'ProfileImage'}
                data-input="avatar"
                onClick={Images.handleBrowseFile}>
          <span className="loader"><i className="fa fa-spinner fa-spin fa-3x"/></span>
          {/*{this.state.avatar &&*/}
          {/*<img src={this.state.avatar} alt={me.name}/>*/}
          {/*}*/}
          <StoreImage src={me.avatar}/>
          <div className="image-input-container">
            <input type="file" id="avatar" name="image" onChange={this.handleFileChange}/>
          </div>
        </figure>
      </figure>

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


      <pre>{JSON.stringify(me, null, 2)}</pre>
    </div>
  }
}


// const mapStateToProps = (state) => {
//     return {me: state.auth.me}
// };
//
// const mapDispatchToProps = (dispatch) => {
//     return {
//         uploadCoverImage: (values) => {
//             dispatch(uploadCoverImage(values));
//         },
//         uploadProfileImage: (values) => {
//             dispatch(uploadProfileImage(values));
//         },
//     }
// };

export default Images//connect(mapStateToProps, mapDispatchToProps)(Images);
