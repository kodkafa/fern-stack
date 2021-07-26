import {firebase, auth, database, firestore} from 'rest/firebase/initialize'
import {action, makeObservable, observable} from 'mobx'
import {Account as Model} from 'rest/models'
import moment from 'moment'

export class AuthStore {
  authenticated = false
  uid = null
  me = new Model({})

  constructor(Stores) {
    this.stores = Stores
    makeObservable(this, {
      uid: observable,
      authenticated: observable,
      me: observable,
      changeDisplayName: action,
      handleAuth: action,
      reAuth: action,
      signOut: action,
      getUserData: action,
    })
  }

  getUserData = async data => {
    if (this.authenticated || !data) return false

    const user = await firestore
      .collection('users')
      .doc(data.uid)
      .get()
      .then(doc => (doc.exists ? doc.data() : {}))
      .catch(error => this.stores.SystemMessageStore.handleError(error))

    // replace user custom claims data with original
    const customClaims = await auth
      .currentUser.getIdTokenResult()
      .then(result => result.claims)
      .catch(error => this.stores.SystemMessageStore.handleError(error))

    this.authenticated = true
    console.log({'this.authenticated': this.authenticated})
    //const auth = new AuthModel({...user, customClaims: result.claims});
    this.me = new Model({uid: data.uid, ...user, customClaims})
    // console.log('me', customClaims);
  }

  createUserWithEmailPassword = async ({
    username,
    first,
    last,
    born = null,
    email,
    password,
  }) => {
    try {
      await auth
        .createUserWithEmailAndPassword(email, password)
        .then(async data => {
          const {user} = data
          await firestore
            .collection('users')
            .doc(user.uid)
            .set({
              username: username || user.uid,
              first,
              last,
              born,
            })
            .catch(error => this.stores.SystemMessageStore.handleError(error))
        })
    } catch (error) {
      return this.stores.SystemMessageStore.handleError(error)
    }
    return true
  }

  test = () => {
    const user = this.me
    const username = 'goker' //user.username;
    console.log('test', {user})
    firestore
      .collection('users')
      .doc(user.uid)
      .set({
        username,
        first: 'goker',
        last: 'cebeci',
        born: '1983',
      })
      .catch(error => this.stores.SystemMessageStore.handleError(error))
    firestore
      .collection('usernames')
      .doc(username)
      .set({
        uid: user.uid,
      })
      .catch(error =>
        this.stores.SystemMessageStore.handleError({
          code: 'CLAIMED_USERNAME',
          message:
            'The username has already been claimed. Please, select a different one.',
        })
      )
  }

  userSave = ({user, username, first, last, born}) => {
    const ref = firestore
      .collection('users')
      .doc(user.uid)
      .set({
        username: username || user.uid,
        first,
        last,
        born,
      })
      .catch(e => {
        console.log('ERROR', e)
      })
    console.log(ref)
  }

  signIn = async ({email, password}) => {
    try {
      await auth
        .setPersistence(firebase.auth.Auth.Persistence.SESSION)
        .then(
          async () =>
            await auth
              .signInWithEmailAndPassword(email, password)
              .then(async result => await this.getUserData(result.user))
        )
    } catch (error) {
      return this.stores.SystemMessageStore.handleError(error)
    }
    return true
  }

  handleAuth = () => {
    // Force refresh to pick up the latest custom claims changes.
    // Note this is always triggered on first call. Further optimization could be
    // added to avoid the initial trigger when the token is issued and already contains
    // the latest claims.

    console.log('handleAuth')

    let callback = null
    let metadataRef = null
    auth.onAuthStateChanged(user => {
      //this.authenticated = null;
      if (callback) metadataRef.off('value', callback)
      if (user) {
        metadataRef = database
          .ref('metadata/' + user.uid + '/refreshTime')
        callback = snapshot => user.getIdToken(true)
        metadataRef.on('value', callback)
        return this.getUserData(user)
      } //else this.authenticated = false;
    })
  }

  signOut = async () =>
    await auth
      .signOut()
      .then(user => {
        this.authenticated = false
        localStorage.clear()
        return user
      })
      .catch(error => error)

  reAuth = currentPassword => {
    const user = auth.currentUser
    if (user !== null) this.displayName = user.displayName
    const cred = firebase.auth.EmailAuthProvider.credential(
      user.email,
      currentPassword
    )
    return user.reauthenticateWithCredential(cred)
  }

  changeUserPassword = async ({currentPassword, newPassword}) => {
    try {
      await this.reAuth(currentPassword).then(() =>
        auth.currentUser.updatePassword(newPassword)
      )
    } catch (error) {
      return this.stores.SystemMessageStore.handleError(error)
    }
    return this.stores.SystemMessageStore.handleSuccess({
      message: 'Your password has been successfully changed!',
    })
  }

  changeDisplayName = displayName => {
    this.displayName = displayName
    return auth.currentUser.updateProfile({displayName})
  }

  reset = async ({email}) => {
    try {
      await auth.sendPasswordResetEmail(email)
    } catch (error) {
      return this.stores.SystemMessageStore.handleError(error)
    }
    return this.stores.SystemMessageStore.handleSuccess({
      message: 'Check your email!',
    })
  }

  date = date => {
    return moment(date).format('YYYY-MM-DD HH:ss')
    // return moment(date).tz('Turkey').format('YYYY-MM-DD HH:ss')
  }
}
