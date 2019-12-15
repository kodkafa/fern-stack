import firebase from 'firebase/app';
import {computed, observable} from "mobx";
import {stores} from "stores";

const toDate = (date) => date instanceof firebase.firestore.Timestamp ? date.toDate() : firebase.firestore.Timestamp.fromDate(date).toDate();


export class UserModel {

  //@observable uid;
  @observable cover;
  @observable avatar;
  @observable _born;
  @observable customClaims;

  constructor(data) {
    console.log('user model constructor', data);
    this.uid = data.uid;
    this.username = data.hasOwnProperty('username') ? data.username : data.uid;
    this.first = data.first || '';
    this.last = data.last || '';
    this._born = data.born || new Date();// || firebase.firestore.Timestamp.fromDate(new Date());//toDate(data.born);
    //console.log('this.born', this.born);
    this.bio = data.bio || '';
    this.avatar = data.avatar || null;
    this.cover = data.cover || null;
    // this.name = this.displayName = data.displayName;
    // this.photoURL = data.photoURL || 'http://holder.ninja/ninja,fee:300x300.svg';
    // this.metadata = data.metadata;
    // this.lastLogin = this.metadata && this.metadata.lastSignInTime;
    // this.createdAt = this.metadata && this.metadata.creationTime;
    // this.providerData = data.providerData;
    this.customClaims = data.customClaims || {};
    this.icon = this.isAdmin() ? 'fas fa-user-astronaut'
      : this.isEditor() ? 'fa fa-user-secret'
        : this.isManager() || this.isWorker() ? 'fa fa-user-tie' : 'fa fa-user';
    this.disabled = data.disabled;
  }

  isAdmin = () => {
    return 'admin' in this.customClaims && this.customClaims.admin
  };

  isEditor = () => {
    return 'editor' in this.customClaims && this.customClaims.editor
  };

  isManager = () => {
    return 'manager' in this.customClaims && this.customClaims.manager
  };

  isWorker = () => {
    return 'worker' in this.customClaims && this.customClaims.worker
  };

  get id() {
    return this.uid
  }

  get name() {
    return this.first + ' ' + this.last
  }

  @computed
  get born() {
    return this._born instanceof firebase.firestore.Timestamp ? this._born.toDate() : this._born
  }

  set born(date) {
    this._born = date;
  }

  save = async () => {
    try {
      const {uid, first, last, born, bio, avatar, cover} = this;
      await firebase.firestore()
        .collection('users')
        .doc(uid)
        .update({first, last, born, bio, avatar, cover})
        .then()
        .catch(error => stores.SystemMessageStore.handleError(error));
      //await this.service.put(uid, {first, last, born, bio});
      if (uid === stores.AuthStore.me.uid)
        await stores.AuthStore.getUserData({uid});
    } catch (error) {
      stores.SystemMessageStore.handleError(error)
    }
  };

  changeUsername = async (username) => {
    try {
      const {uid} = stores.AuthStore.me;

      console.log({username})

      const isOK = await firebase.firestore()
        .collection('usernames')
        .doc(username)
        .set({uid})
        .then(r => true)
        .catch(error => stores.SystemMessageStore.handleError({
          code: "CLAIMED_USERNAME",
          message: "The username has already been claimed. Please, select a different one."
        }));

      console.log({isOK});

      if (isOK) {

        await firebase.firestore()
          .collection('users')
          .doc(uid)
          .update({username})
          .then()
          .catch(error => stores.SystemMessageStore.handleError(error));

        await firebase.firestore()
          .collection('usernames')
          .doc(this.username)
          .delete()
          .then(r => null).catch(e => null);
        //await this.service.put(uid, {first, last, born, bio});
        if (uid === stores.AuthStore.me.uid)
          await stores.AuthStore.getUserData({uid});
      }
    } catch (error) {
      stores.SystemMessageStore.handleError(error)
    }
  };

  toggleAdmin = async () => {
    try {
      await stores.UserStore.service.toggleAdmin(this.uid, {admin: !this.isAdmin()})
    } catch (error) {
      console.log(error)
    }
  }

}
