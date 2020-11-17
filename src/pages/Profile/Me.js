import {inject, observer} from 'mobx-react'
import {autorun} from 'mobx'
import React, {useEffect, useRef, useState} from 'react'
import {ImageViewer} from '../../components'
import AvatarEditor from 'react-avatar-editor'
import {Link, useParams} from 'react-router-dom'

import {Modal} from '../../components'

const handleBrowseFile = e => {
  e.stopPropagation()
  document.getElementById(e.currentTarget.dataset.input).click()
}

export const Me = inject(
  'AuthStore',
  'UserStore'
)(
  observer(props => {
    const params = useParams()

    useEffect(
      () =>
        autorun(() => {
          props.UserStore.getUserByUsername(
            params.username || props.AuthStore.me.uid
          )
        }),
      [props.UserStore, params.username, props.AuthStore.me.uid]
    )

    const user = props.AuthStore.me
    const avatarEditor = useRef(null)
    const coverEditor = useRef(null)

    const [cover, setCover] = useState(null)
    const [width, setWidth] = useState(1320)
    const [height, setHeight] = useState(320)

    const [avatar, setAvatar] = useState(null)
    const [avatarScale, setAvatarScale] = useState(1.2)
    const [avatarProgress, setAvatarProgress] = useState(0)
    const [showModal, setShowModal] = useState(false)
    const closeModal = () => setShowModal(false)

    const handleFileChange = e => {
      if (e.target.id === 'avatar') {
        setAvatar(e.target.files[0])
        setShowModal(true)
      }
      if (e.target.id === 'cover') {
        const width = document.getElementById('cover-figure').offsetWidth
        const height = width * 0.25
        console.log(width, height)
        setCover(e.target.files[0])
        setWidth(width)
        setHeight(height)
      }
    }

    const handleScaleChange = e => setAvatarScale(e.target.value)

    const uploadAvatar = async () => {
      if (avatarEditor) {
        const canvas = avatarEditor.current.getImageScaledToCanvas().toDataURL()
        const image = await fetch(canvas).then(res => res.blob())
        await props.UserStore.uploadAvatar({
          image,
          progress: i => {
            console.log({i})
            setAvatarProgress(i)
          },
          error: err => console.log({err}),
          complete: () => setShowModal(false),
        })
      }
    }

    const uploadCover = async () => {
      if (coverEditor) {
        const dataURL = coverEditor.current.getImageScaledToCanvas().toDataURL()
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        const img = new Image()
        img.onload = async () => {
          ctx.drawImage(img, 0, 0)
          const image = await fetch(canvas.toDataURL()).then(res => res.blob())
          await props.UserStore.uploadCover({
            image,
            progress: progress =>
              (document.getElementById('coverProgress').style.width =
                progress + '%'),
            error: err => console.log({err}),
            complete: () => {
              setCover(null)
              document.getElementById('coverProgress').style.width = 0
            },
          })
        }
        img.src = dataURL
      }
    }

    const cancelCover = () => setCover(null)

    if (user === null)
      return (
        <section className="container">
          <div className="profile">Loading...</div>
        </section>
      )
    if (!user)
      return (
        <section className="container">
          <div className="profile">
            <h3>User not found!</h3>
            <p>{JSON.stringify(process.env)}</p>
          </div>
        </section>
      )

    return (
      <section className="container py-5">
        <div className="profile">
          <figure id="cover-figure" className="cover">
            <div id="coverProgress" className="progress" />
            <div className="buttons">
              <Link className="btn btn-primary" to="/settings">
                Edit Profile
              </Link>
              <button
                className="btn btn-primary ml-1"
                data-input="cover"
                onClick={!cover ? handleBrowseFile : () => null}>
                Change Cover
              </button>
            </div>
            <ImageViewer
              className="img-fluid"
              width={width}
              height={height}
              src={user.cover}
              alt={user.fullname}
            />
            {cover ? (
              <div className="editor" style={{width, height}}>
                <AvatarEditor
                  ref={coverEditor}
                  image={cover}
                  width={width}
                  height={height}
                />
                <div className="buttons">
                  <button className="btn btn-primary" onClick={uploadCover}>
                    Save
                  </button>
                  <button className="btn btn-danger ml-1" onClick={cancelCover}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="image-input-container">
                <input
                  type="file"
                  id="cover"
                  name="image"
                  onChange={handleFileChange}
                />
              </div>
            )}
            <figure className={avatarProgress ? 'avatar uploading' : 'avatar'}>
              <ImageViewer
                className="img-thumbnail"
                width={120}
                height={120}
                src={user.avatar}
                alt={user.fullname}
              />
              <div className="image-input-container">
                <input
                  type="file"
                  id="avatar"
                  name="image"
                  onChange={handleFileChange}
                />
              </div>
              <button
                className="btn btn-primary"
                data-input="avatar"
                onClick={handleBrowseFile}>
                Upload
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
                  <Link className="nav-link" to="/">
                    Home <span className="sr-only">(current)</span>
                  </Link>
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
        <Modal
          show={showModal}
          footer={
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={uploadAvatar}>
                Upload
              </button>{' '}
              <button className="btn btn-secondary" onClick={closeModal}>
                Cancel
              </button>
            </div>
          }>
          <div className="d-flex justify-content-center">
            {avatar && (
              <AvatarEditor
                ref={avatarEditor}
                image={avatar}
                width={250}
                height={250}
                border={50}
                scale={avatarScale}
              />
            )}
          </div>
          <input
            className="form-range"
            type="range"
            onChange={handleScaleChange}
            min="1"
            max="1.5"
            step=".05"
            value={avatarScale}
          />
        </Modal>
      </section>
    )
  })
)
