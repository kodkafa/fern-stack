import {action, observable} from 'mobx';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/database';
import 'firebase/auth';
import {UserModel} from "../models/UserModel";

export default class {
  @observable authenticated = null;
  @observable uid = null;
  @observable me = new UserModel({});


  // console.log('user model constructor', data);
  // this.uid = data.uid;
  // this.username = data.hasOwnProperty('username')? data.username : data.uid;
  // this.phoneNumber = data.phoneNumber;
  // this.email = data.email;
  // this.emailVerified = data.emailVerified;
  // this.name = this.displayName = data.displayName;
  // this.photoURL = data.photoURL || 'http://holder.ninja/ninja,fee:300x300.svg';
  // this.metadata = data.metadata;
  // this.lastLogin = this.metadata && this.metadata.lastSignInTime;
  // this.createdAt = this.metadata && this.metadata.creationTime;
  // this.providerData = data.providerData;
  // this.customClaims = data.customClaims || {};
  // this.icon = this.isAdmin() ? 'fas fa-user-astronaut'
  //   : this.isEditor() ? 'fa fa-user-secret'
  //     : this.isManager() || this.isWorker() ? 'fa fa-user-tie' : 'fa fa-user';
  // this.disabled = data.disabled;

  constructor(Stores) {
    this.stores = Stores;
  }

  @action
  getUserData = async (data) => {
    if (!data) return false;

    const user = await firebase.firestore()
      .collection('users')
      .doc(data.uid)
      .get()
      .then(doc => (doc.exists) ? doc.data() : {})
      .catch(error => this.stores.SystemMessageStore.handleError(error));

    // replace user custom claims data with original
    const customClaims = await firebase.auth().currentUser.getIdTokenResult()
      .then(result => result.claims)
      .catch(error => this.stores.SystemMessageStore.handleError(error));

    this.authenticated = true;
    //const auth = new AuthModel({...user, customClaims: result.claims});
    this.me = new UserModel({uid: data.uid, ...user, customClaims});
    // console.log('me', customClaims);
  };

  createUserWithEmailPassword = ({username, first, last, born, email, password}) => {
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(async data => {
        const {user} = data;
        console.log('THEN', user.uid);
        //this.userSave({user, username, first, last, born})
        // const usernameIsAvailable = await firebase.database()
        //   .ref('usernames')
        //   .child(username)
        //   .set({
        //     uid: user.uid
        //   })
        //   .then()
        //   .catch(error => this.stores.SystemMessageStore.handleError({
        //     code: "UNAVAILABLE USERNAME",
        //     message: `Sorry, the username "${username}" has already been claimed. Please, select a different one.`
        //   }));
        //
        // if (usernameIsAvailable)
        await firebase.firestore()
          .collection('users')
          .doc(user.uid)
          .set({
            username: username || user.uid,
            first,
            last,
            born
          })
          .catch(error => this.stores.SystemMessageStore.handleError(error));
        // else {
        //   await user.delete().then()
        //     .catch(error => this.stores.SystemMessageStore.handleError(error));
        // }

      })
      .catch(error => this.stores.SystemMessageStore.handleError(error));
  };

  test = () => {
    const user = this.me;
    const username = 'goker';//user.username;
    console.log('test', {user});
    firebase.firestore()
      .collection('users')
      .doc(user.uid)
      .set({
        username,
        first: 'goker',
        last: 'cebeci',
        born: '1983'
      })
      .catch(error => this.stores.SystemMessageStore.handleError(error));
    firebase.firestore()
      .collection('usernames')
      .doc(username)
      .set({
        uid: user.uid
      })
      .catch(error => this.stores.SystemMessageStore.handleError({
        code: "CLAIMED_USERNAME",
        message: "The username has already been claimed. Please, select a different one."
      }));
  };

  userSave = ({user, username, first, last, born}) => {
    const ref = firebase.firestore()
      .collection("users")
      .doc(user.uid)
      .set({
        username: username || user.uid,
        first,
        last,
        born
      })
      .catch(e => {
        console.log('ERROR', e)
      });
    console.log(ref);
  };

  signIn = async ({email, password}) =>
    await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
      .then(async () => await firebase.auth().signInWithEmailAndPassword(email, password)
        .then(async result => await this.getUserData(result.user))
        .catch(error => this.stores.SystemMessageStore.handleError(error)))
      .catch(error => this.stores.SystemMessageStore.handleError(error));


  handleAuth = () => {
    // Force refresh to pick up the latest custom claims changes.
    // Note this is always triggered on first call. Further optimization could be
    // added to avoid the initial trigger when the token is issued and already contains
    // the latest claims.
    let callback = null;
    let metadataRef = null;
    firebase.auth().onAuthStateChanged(user => {
      if (callback)
        metadataRef.off('value', callback);
      if (user) {
        metadataRef = firebase.database().ref('metadata/' + user.uid + '/refreshTime');
        callback = (snapshot) => user.getIdToken(true);
        metadataRef.on('value', callback);
        return this.getUserData(user)
      }
    });
  };

  signOut = async () =>
    await firebase.auth().signOut()
      .then(user => {
        this.authenticated = false;
        localStorage.clear();
        return user
      })
      .catch(error => error);

  reAuth = currentPassword => {
    const user = firebase.auth().currentUser;
    if (user !== null) this.displayName = user.displayName;
    const cred = firebase.auth.EmailAuthProvider.credential(user.email, currentPassword);
    return user.reauthenticateWithCredential(cred);
  };

  changeUserPassword = (currentPassword, newPassword) => {
    return this.reAuth(currentPassword).then(() =>
      firebase.auth().currentUser.updatePassword(newPassword)
    );
  };

  changeDisplayName = displayName => {
    this.displayName = displayName;
    return firebase.auth().currentUser.updateProfile({displayName});
  };

}
