import {action, computed, observable, runInAction} from 'mobx';
import firebase from 'firebase/app';
import UserService from '../services/UserService';
import {UserModel} from '../models/UserModel';
import uuid from 'react-uuid';

export default class UserStore {
  @observable isReady = false;
  dbListener = null;
  @observable _list = new observable.map();
  @observable user = null;

  @observable data = null;
  @observable status = "initial";
  @observable searchQuery = "";

  constructor(Stores) {
    this.stores = Stores;
    this.service = new UserService();
    this.model = UserModel;
  }

  get list() {
    if (!this.dbListener) {
      this.listenToDB();
    }
    return this._list;
  }

  @computed
  set list(item) {
    return this._list.set(item);
  }

  @action
  getUsers = async () => {
    try {
      const params = {
        // pageNumber: this.pageNumber,
        searchQuery: this.searchQuery,
        //isAscending: this.isAscending
        nextPageToken: null,
      };
      const urlParams = new URLSearchParams(Object.entries(params));

      // const data = await firebase.functions().httpsCallable('users/', {method:"GET"})({params: {nextPageToken: null}});
      // this.data = data;
      // console.log('function call users', this.data);
      this.data = await this.service.get(urlParams);
      this.data.map(item => new UserModel(item));
      this.status = 'ready';
    } catch (error) {
      this.status = "error";
      console.error(error);
    }
  };


  @action
  getUserById = async (uid) => {
    const item = this._list.get(uid);
    if (item) return item;
    try {
      const user = firebase.firestore()
        .collection('users')
        .doc(uid)
        .get()
        .then()
        .catch(error => this.stores.SystemMessageStore.handleError(error));
      this.data = new UserModel(user);
      this.status = 'ready';
    } catch (error) {
      this.status = "error";
      console.error(error);
    }
  };

  @action
  getUserByUsername = async (username) => {
    if (!username) return;
    try {
      const uid = username.match(/^.{5,22}$/)
        ? await firebase.firestore()
          .collection('usernames')
          .doc(username)
          .get()
          .then(doc => doc.exists && doc.data().uid)
          .catch(error => this.stores.SystemMessageStore.handleError(error))
        : username;
      if (!uid) {
        this.data = false;
        return;
      }
      const user = await firebase.firestore()
        .collection('users')
        .doc(uid)
        .get()
        .then(doc => doc.exists && doc.data())
        .catch(error => this.stores.SystemMessageStore.handleError(error));

      this.data = new UserModel({uid, ...user});
      this.status = 'ready';
      return this.data;
    } catch (error) {
      this.status = "error";
      console.error(error);
    }
  };

  updateUserById = async ({id, first, last, born, bio}) => {
    try {
      const user = this.list.get(id);
      user.first = first;
      user.last = last;
      user.born = born;
      user.bio = bio;
      user.save();
      this.status = 'ready';
    } catch (error) {
      this.status = "error";
      console.error(error);
    }
  };

  updateMe = async ({first, last, born, bio}) => {
    const uid = this.stores.AuthStore.me.uid;
    try {
      await firebase.firestore()
        .collection('users')
        .doc(uid)
        .update({first, last, born, bio})
        .then();
      await this.stores.AuthStore.getUserData({uid});
      this.status = 'ready';
    } catch (error) {
      return  this.stores.SystemMessageStore.handleError(error)
    }
    return true;
  };

  deleteImage = (name) => {
    if (typeof name === 'string') {
      const storage = firebase.storage();
      storage.ref('images/').child(name).delete()
    }
  };

  uploadAvatar = (image, progress = () => null, error = () => null, complete = () => null) => {
    const storage = firebase.storage();

    const avatar = uuid() + ".png";

    const uploading = storage.ref('images/').child(avatar)
      .put(image, {
        contentType: 'image/png'
      });

    uploading.on('state_changed',
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        progress((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        //console.log('Upload is ' + progress + '% done');
        // switch (snapshot.state) {
        //   case firebase.storage.TaskState.PAUSED: // or 'paused'
        //     console.log('Upload is paused');
        //     break;
        //   case firebase.storage.TaskState.RUNNING: // or 'running'
        //     console.log('Upload is running');
        //     break;
        // }
      }, error, () => {

        this.deleteImage(this.stores.AuthStore.me.avatar);
        this.stores.AuthStore.me.avatar = avatar;
        this.stores.AuthStore.me.save();
        complete();
      });
    // uploading.snapshot.ref.getDownloadURL()
    //   .then((downloadURL) => {
    //     console.log('File available at', downloadURL);
    //     this.toggleAvatarModal()
    //   });
  };

  uploadCover = (image, progress = () => null, error = () => null, complete = () => null) => {
    const storage = firebase.storage();

    const name = uuid() + ".png";

    const uploading = storage.ref('images/').child(name)
      .put(image, {
        contentType: 'image/png'
      });

    uploading.on('state_changed',
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        progress((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        //console.log('Upload is ' + progress + '% done');
        // switch (snapshot.state) {
        //   case firebase.storage.TaskState.PAUSED: // or 'paused'
        //     console.log('Upload is paused');
        //     break;
        //   case firebase.storage.TaskState.RUNNING: // or 'running'
        //     console.log('Upload is running');
        //     break;
        // }
      }, error, () => {

        this.deleteImage(this.stores.AuthStore.me.cover);
        this.stores.AuthStore.me.cover = name;
        this.stores.AuthStore.me.save();
        complete();
      });
    // uploading.snapshot.ref.getDownloadURL()
    //   .then((downloadURL) => {
    //     console.log('File available at', downloadURL);
    //     this.toggleAvatarModal()
    //   });
  };


  listenToDB = agencyId => {
    this.dbListener = firebase
      .firestore()
      .collection('users')
      //.orderBy('createdAt', 'asc')
      .onSnapshot(snapshot => {
        runInAction(() => {
          this.isReady = true;
          snapshot.docChanges().forEach(change => {
            const doc = change.doc.data();
            doc.uid = change.doc.id;
            if (change.type === 'added' || change.type === 'modified') {
              this.handleAdd(doc);
            }
            if (change.type === 'removed') {
              this.handleRemove(doc.uid);
            }
          });
        });
      });
  };

  @action
  handleRemove(docId) {
    this._list.delete(docId);
  }

  @action
  handleAdd(doc) {
    const item = new this.model(doc);
    if (this._list.has(doc.uid)) {
      if (JSON.stringify(item) !== JSON.stringify(this._list.get(doc.uid)))
        this._list.set(doc.uid, item);
    } else
      this._list.set(doc.uid, item);
  }

}
