import {action, observable} from 'mobx';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/database';
import 'firebase/auth';
import {UserModel} from "../models/UserModel";
import moment from "moment";

export default class {
  @observable authenticated = false;
  @observable uid = null;
  @observable me = new UserModel({});

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

  createUserWithEmailPassword = async ({username, first, last, born, email, password}) => {
    try {
      await firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(async data => {
          const {user} = data;
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
        })
    } catch (error) {
      return this.stores.SystemMessageStore.handleError(error)
    }
    return true;
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

  signIn = async ({email, password}) => {
    try {
      await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
        .then(async () => await firebase.auth().signInWithEmailAndPassword(email, password)
          .then(async result => await this.getUserData(result.user)));
    } catch (error) {
      return this.stores.SystemMessageStore.handleError(error);
    }
    return true;
  };


  handleAuth = () => {
    // Force refresh to pick up the latest custom claims changes.
    // Note this is always triggered on first call. Further optimization could be
    // added to avoid the initial trigger when the token is issued and already contains
    // the latest claims.
    let callback = null;
    let metadataRef = null;
    firebase.auth().onAuthStateChanged(user => {
      this.authenticated = null;
      if (callback)
        metadataRef.off('value', callback);
      if (user) {
        metadataRef = firebase.database().ref('metadata/' + user.uid + '/refreshTime');
        callback = (snapshot) => user.getIdToken(true);
        metadataRef.on('value', callback);
        return this.getUserData(user)
      } else this.authenticated = false;
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

  changeUserPassword = async ({currentPassword, newPassword}) => {
    try {
      await this.reAuth(currentPassword).then(() =>
        firebase.auth().currentUser.updatePassword(newPassword)
      );
    } catch (error) {
      return this.stores.SystemMessageStore.handleError(error);
    }
    return true;
  };

  changeDisplayName = displayName => {
    this.displayName = displayName;
    return firebase.auth().currentUser.updateProfile({displayName});
  };

  reset = async ({email}) => {
    try {
      await firebase.auth().sendPasswordResetEmail(email);
    } catch (error) {
      return this.stores.SystemMessageStore.handleError(error);
    }
    return true;
  };

  date = (date) => {
    return moment(date).format('YYYY-MM-DD HH:ss')
    // return moment(date).tz('Turkey').format('YYYY-MM-DD HH:ss')
  }

}
