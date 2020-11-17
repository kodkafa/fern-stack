import {firebase} from 'fb/initialize'
import {computed, makeObservable, observable} from 'mobx'
import {stores} from 'stores'

export class User {
  constructor(data) {
    this.id = data.id
    this.username = data.hasOwnProperty('username') ? data.username : data.uid
    this.first = data.first || ''
    this.last = data.last || ''
    this._born = data.born || new Date()
    this.bio = data.bio || ''
    this.avatar = data.avatar || null
    this.cover = data.cover || null
    this.customClaims = data.customClaims || {}
    this.icon = this.isAdmin
      ? 'fas fa-user-astronaut'
      : this.isEditor
      ? 'fa fa-user-graduate'
      : this.isManager
      ? 'fa fa-user-secret'
      : this.isWorker
      ? 'fa fa-user-tie'
      : 'fa fa-user'
    this.disabled = data.disabled

    makeObservable(this, {
      cover: observable,
      avatar: observable,
      _born: observable,
      customClaims: observable,
      isAdmin: computed,
      isEditor: computed,
      isManager: computed,
      isWorker: computed,
      isUser: computed,
      name: computed,
    })
  }

  get born() {
    return this._born instanceof firebase.firestore.Timestamp
      ? this._born.toDate()
      : this._born
  }

  set born(date) {
    this._born = date
  }

  get isAdmin() {
    return 'admin' in this.customClaims && this.customClaims.admin
  }

  get isEditor() {
    return 'editor' in this.customClaims && this.customClaims.editor
  }

  get isManager() {
    return 'manager' in this.customClaims && this.customClaims.manager
  }

  get isWorker() {
    return 'worker' in this.customClaims && this.customClaims.worker
  }

  get isUser() {
    return !this.disabled
  }

  get name() {
    return this.first + ' ' + this.last
  }

  save = async () => {
    try {
      const {uid, first, last, born, bio, avatar, cover} = this
      await firebase
        .firestore()
        .collection('users')
        .doc(uid)
        .update({first, last, born, bio, avatar, cover})
        .then()
        .catch(error => stores.SystemMessageStore.handleError(error))
      //await this.service.put(uid, {first, last, born, bio});
      if (uid === stores.AuthStore.me.uid)
        await stores.AuthStore.getUserData({uid})
    } catch (error) {
      stores.SystemMessageStore.handleError(error)
    }
  }

  changeUsername = async ({username}) => {
    try {
      const {uid} = stores.AuthStore.me
      const isOK = await firebase
        .firestore()
        .collection('usernames')
        .doc(username)
        .set({uid})
        .then(() => true)

      if (isOK) {
        await firebase
          .firestore()
          .collection('users')
          .doc(uid)
          .update({username})
          .then()

        await firebase
          .firestore()
          .collection('usernames')
          .doc(this.username)
          .delete()
          .then(() => null)

        if (uid === stores.AuthStore.me.uid)
          await stores.AuthStore.getUserData({uid})
      }
    } catch (error) {
      // custom error message for user friendly message
      return stores.SystemMessageStore.handleError({
        code: 'CLAIMED_USERNAME',
        message:
          'The username has already been claimed. Please, select a different one.',
      })
    }
    return true
  }

  toggleClaim = async type => {
    try {
      const data =
        type === 'admin'
          ? {
              admin: !this.isAdmin,
            }
          : type === 'editor'
          ? {
              editor: !this.isEditor,
            }
          : type === 'manager'
          ? {
              manager: !this.isManager,
            }
          : type === 'worker'
          ? {
              worker: !this.isWorker,
            }
          : {disable: this.isUser}

      await stores.UserStore.service.toggleClaim(this.uid, data)
    } catch (error) {
      console.log(error)
    }
  }
  toggleAdmin = async () => {
    try {
      await stores.UserStore.service.toggleAdmin(this.uid, {
        admin: !this.isAdmin(),
      })
    } catch (error) {
      console.log(error)
    }
  }

  toggleEditor = async () => {
    try {
      await stores.UserStore.service.toggleEditor(this.uid, {
        editor: !this.isEditor(),
      })
    } catch (error) {
      console.log(error)
    }
  }
}
