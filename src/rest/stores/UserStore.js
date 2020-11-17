import {db, firebase} from 'fb/initialize'
import {action, computed, makeObservable, observable, runInAction} from 'mobx'
import {UserServices as Services} from 'services'
import {User as Model} from 'models'
import uuid from 'react-uuid'

export class UserStore {
  isReady = false
  dbListener = null
  user = null
  data = null
  status = 'initial'
  searchQuery = ''

  constructor(Stores) {
    this.stores = Stores
    makeObservable(this, {
      isReady: observable,
      _list: observable,
      user: observable,
      data: observable,
      status: observable,
      searchQuery: observable,
      list: computed,
      read: action,
      getUsers: action,
      getUserById: action,
      getUserByUsername: action,
      handleAdd: action,
      handleRemove: action,
    })
  }

  _list = new observable.map()

  get list() {
    // if (!this.dbListener) {
    //   this.listenToDB()
    // }
    return this._list
  }

  set list(item) {
    return this._list.set(item)
  }

  read = async () => {
    // try {
    const params = {
      // pageNumber: this.pageNumber,
      searchQuery: this.searchQuery,
      //isAscending: this.isAscending
      nextPageToken: null,
    }
    const urlParams = new URLSearchParams(Object.entries(params))

    // const data = await firebase.functions().httpsCallable('users/', {method:"GET"})({params: {nextPageToken: null}})
    // this.data = data
    // console.log('function call users', this.data)

    const ref = db
      .collection('users')
      .orderBy('username', 'asc')
      //.orderBy("last", "asc")
      .startAfter('rjkYw1I2lNgSkeUVSEIjZhj0AcT2')
      .limit(8)
    const snapshot = await ref.get() //.where('capital', '==', true).get();
    if (snapshot.empty) {
      console.log('No matching documents.')
      throw new Error("'No matching documents.'")
    }

    snapshot.forEach(doc => {
      // console.log(doc.id, '=>', doc.data());
      this._list.set(doc.id, new Model({id: doc.id, ...doc.data()}))
    })
    const lastVisible = snapshot.docs[snapshot.docs.length - 1]
    console.log('last', lastVisible)

    // console.log('read')
    // this.data = await Services.get(urlParams)
    // console.log({data:this.data})
    // this.data.map(item => new Model(item))
    // this.status = 'ready'
    // } catch (error) {
    //   this.status = 'error'
    //   console.error(error)
    // }
  }

  getUsers = async () => {
    try {
      const params = {
        // pageNumber: this.pageNumber,
        searchQuery: this.searchQuery,
        //isAscending: this.isAscending
        nextPageToken: null,
      }
      const urlParams = new URLSearchParams(Object.entries(params))

      // const data = await firebase.functions().httpsCallable('users/', {method:"GET"})({params: {nextPageToken: null}})
      // this.data = data
      // console.log('function call users', this.data)
      this.data = await Services.get(urlParams)
      this.data.map(item => new Model(item))
      this.status = 'ready'
    } catch (error) {
      this.status = 'error'
      console.error(error)
    }
  }

  getUserById = async uid => {
    const item = this._list.get(uid)
    if (item) return item
    try {
      const user = firebase
        .firestore()
        .collection('users')
        .doc(uid)
        .get()
        .then()
        .catch(error => this.stores.SystemMessageStore.handleError(error))
      this.data = new Model(user)
      this.status = 'ready'
    } catch (error) {
      this.status = 'error'
      console.error(error)
    }
  }

  getUserByUsername = async username => {
    if (!username) return
    try {
      const uid = username.match(/^.{5,22}$/)
        ? await firebase
            .firestore()
            .collection('usernames')
            .doc(username)
            .get()
            .then(doc => doc.exists && doc.data().uid)
            .catch(error => this.stores.SystemMessageStore.handleError(error))
        : username
      if (!uid) {
        this.data = false
        return
      }
      const user = await firebase
        .firestore()
        .collection('users')
        .doc(uid)
        .get()
        .then(doc => doc.exists && doc.data())
        .catch(error => this.stores.SystemMessageStore.handleError(error))

      this.data = new Model({uid, ...user})
      this.status = 'ready'
      return this.data
    } catch (error) {
      this.status = 'error'
      console.error(error)
    }
  }

  updateUserById = async ({id, first, last, born, bio}) => {
    console.log({id, first, last, born, bio})
    try {
      const user = this.list.get(id)
      user.first = first
      user.last = last
      user.born = born
      user.bio = bio
      user.save()
      this.status = 'ready'
    } catch (error) {
      this.status = 'error'
      console.error(error)
    }
  }

  updateMe = async ({first, last, born, bio}) => {
    const uid = this.stores.AuthStore.me.uid
    try {
      await firebase
        .firestore()
        .collection('users')
        .doc(uid)
        .update({first, last, born, bio})
        .then()
      await this.stores.AuthStore.getUserData({uid})
      this.status = 'ready'
    } catch (error) {
      return this.stores.SystemMessageStore.handleError(error)
    }
    return this.stores.SystemMessageStore.handleSuccess({
      message: 'Your account has been successfully updated!',
    })
  }

  deleteImage = async name => {
    if (typeof name === 'string') {
      const storage = firebase.storage()
      await storage.ref('images/').child(name).delete()
    }
  }

  uploadFile = (
    {image, progress = () => null, error = () => null, complete = () => null},
    mode = 'avatar'
  ) => {
    const storage = firebase.storage()
    const name = uuid() + '.png'
    const uploading = storage.ref('images/').child(name).put(image, {
      contentType: 'image/png',
    })
    uploading.on(
      'state_changed',
      snapshot => {
        progress((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
      },
      error,
      async () => {
        await this.deleteImage(this.stores.AuthStore.me[mode])
        this.stores.AuthStore.me[mode] = name
        await this.stores.AuthStore.me.save()
        complete()
      }
    )
  }

  uploadAvatar = async params => await this.uploadFile(params, 'avatar')
  uploadCover = async params => await this.uploadFile(params, 'cover')

  listenToDB = agencyId => {
    this.dbListener = firebase
      .firestore()
      .collection('users')
      //.orderBy('createdAt', 'asc')
      .onSnapshot(snapshot => {
        runInAction(() => {
          this.isReady = true
          snapshot.docChanges().forEach(change => {
            const doc = change.doc.data()
            doc.uid = change.doc.id
            if (change.type === 'added' || change.type === 'modified') {
              this.handleAdd(doc)
            }
            if (change.type === 'removed') {
              this.handleRemove(doc.uid)
            }
          })
        })
      })
  }

  handleRemove(docId) {
    this._list.delete(docId)
  }

  handleAdd(doc) {
    const item = new Model(doc)
    if (this._list.has(doc.uid)) {
      if (JSON.stringify(item) !== JSON.stringify(this._list.get(doc.uid)))
        this._list.set(doc.uid, item)
    } else this._list.set(doc.uid, item)
  }
}
