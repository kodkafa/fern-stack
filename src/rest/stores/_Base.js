import {firestore} from 'rest/firebase/initialize'
import {action, computed, makeObservable, observable, runInAction} from 'mobx'
import {Project as Model} from 'rest/models'
import uuid from 'react-uuid'

export class _Base {
  #collection = ''
  searchQuery = ''

  constructor(Stores, Model, collection) {
    this.stores = Stores
    this.item = new Model()
    this.#collection = collection

    makeObservable(this, {
      _list: observable,
      item: observable,
      searchQuery: observable,
      list: computed,
      next: computed,
      // create: action,
      //read: action,
      // update: action,
      delete: action,
      getItemById: action,
    })
  }

  get newID() {
    return this.#collection.replace(/s$/, '-' + uuid())
  }

  _list = new observable.map()

  get list() {
    return [...this._list.values()]
  }

  get next() {
    return (this.list[this.list.length - 1] || {}).id
  }

  create = async data => {
    const id = this.newID
    const item = new Model({id, ...data})
    return await firestore
      .collection(this.#collection)
      .doc(id)
      .withConverter(Model)
      .set(item)
      .then(
        runInAction(() => {
          this._list.set(id, item)
        })
      )
      .catch(error => this.stores.SystemMessageStore.handleError(error))
  }

  read = async ({id, q = null, limit = 10, order = 'asc', more = false}) => {
    if (id) {
      if (this._list.get(id)) {
        runInAction(() => {
          this.item = this._list.get(id)
        })
        return
      }
      return await firestore
        .collection(this.#collection)
        .doc(id)
        .get()
        .then(doc => {
          runInAction(() => {
            this.item = new Model(
              (doc.exists && {id: doc.id, ...doc.data()}) || {}
            )
          })
        })
        .catch(error => this.stores.SystemMessageStore.handleError(error))
    }
    // try {

    //const urlParams = new URLSearchParams(Object.entries(params))

    // const data = await firebase.functions().httpsCallable('users/', {method:"GET"})({params: {nextPageToken: null}})
    // this.data = data
    // console.log('function call users', this.data)

    let ref = firestore.collection(this.#collection)
    // .orderBy('username', order)
    //
    //.orderBy('last', order)

    // search
    //if (q)
    // ref = ref.where('username', '>=', q).where('username', '<=', q + '\uf8ff')
    if (q)
      ref = ref
        .where('name', '>=', q)
        .where('name', '<=', q + '\uf8ff')
        .orderBy('name', order) //
    //pagination (cursor query)

    if (more && this.cursor) {
      console.log({more, cursor: this.cursor})

      ref = ref.startAfter(this.cursor)
    }
    ref = ref.orderBy('createdAt', order).limit(limit)
    const snapshot = await ref.get() //.where('capital', '==', true).get();
    if (snapshot.empty) {
      console.log('No matching documents.')
      //throw new Error("'No matching documents.'")
    }

    snapshot.forEach(doc => {
      runInAction(() => {
        this._list.set(doc.id, new Model({id: doc.id, ...doc.data()}))
      })
    })
    this.cursor = snapshot.docs[snapshot.docs.length - 1]
    // console.log('last', lastVisible)

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

  // getUsers = async () => {
  //   try {
  //     const params = {
  //       // pageNumber: this.pageNumber,
  //       searchQuery: this.searchQuery,
  //       //isAscending: this.isAscending
  //       nextPageToken: null,
  //     }
  //     const urlParams = new URLSearchParams(Object.entries(params))
  //
  //     // const data = await firebase.functions().httpsCallable('users/', {method:"GET"})({params: {nextPageToken: null}})
  //     // this.data = data
  //     // console.log('function call users', this.data)
  //     this.data = await Services.get(urlParams)
  //     this.data.map(item => new Model(item))
  //     this.status = 'ready'
  //   } catch (error) {
  //     this.status = 'error'
  //     console.error(error)
  //   }
  // }

  update = async ({id, ...data}) => {
    const item = new Model({id, ...this._list.get(id), ...data})
    return await firestore
      .collection(this.#collection)
      .doc(id)
      .withConverter(Model)
      .set(item)
      .then(
        runInAction(() => {
          this._list.set(id, item)
        })
      )
      .catch(error => this.stores.SystemMessageStore.handleError(error))
  }

  delete = async id => {
    return await firestore
      .collection(this.#collection)
      .doc(id)
      .delete()
      .then(
        runInAction(() => {
          this._list.delete(id)
        })
      )
      .catch(error => this.stores.SystemMessageStore.handleError(error))
  }

  // toggleClaimById = async ({id, position}) => {
  //     console.log({id, position})
  //     try {
  //         const user = this._list.get(id)
  //         await user.toggleClaim(position)
  //     } catch (error) {
  //         this.status = 'error'
  //         console.error(error)
  //     }
  // }

  // updateMe = async ({first, last, born, bio}) => {
  //     const uid = this.stores.AuthStore.me.uid
  //     try {
  //         await firebase
  //             .firestore()
  //             .collection('users')
  //             .doc(uid)
  //             .update({first, last, born, bio})
  //             .then()
  //         await this.stores.AuthStore.getUserData({uid})
  //         this.status = 'ready'
  //     } catch (error) {
  //         return this.stores.SystemMessageStore.handleError(error)
  //     }
  //     return this.stores.SystemMessageStore.handleSuccess({
  //         message: 'Your account has been successfully updated!',
  //     })
  // }
  //
  // deleteImage = async name => {
  //     if (typeof name === 'string') {
  //         const storage = firebase.storage()
  //         await storage.ref('images/').child(name).delete()
  //     }
  // }
  //
  // uploadFile = (
  //     {image, progress = () => null, error = () => null, complete = () => null},
  //     mode = 'avatar'
  // ) => {
  //     const storage = firebase.storage()
  //     const name = uuid() + '.png'
  //     const uploading = storage.ref('images/').child(name).put(image, {
  //         contentType: 'image/png',
  //     })
  //     uploading.on(
  //         'state_changed',
  //         snapshot => {
  //             progress((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
  //         },
  //         error,
  //         async () => {
  //             await this.deleteImage(this.stores.AuthStore.me[mode])
  //             this.stores.AuthStore.me[mode] = name
  //             await this.stores.AuthStore.me.save()
  //             complete()
  //         }
  //     )
  // }
  //
  // uploadAvatar = async params => await this.uploadFile(params, 'avatar')
  // uploadCover = async params => await this.uploadFile(params, 'cover')
  //
  // listenToDB = agencyId => {
  //     this.dbListener = firebase
  //         .firestore()
  //         .collection('users')
  //         //.orderBy('createdAt', 'asc')
  //         .onSnapshot(snapshot => {
  //             runInAction(() => {
  //                 this.isReady = true
  //                 snapshot.docChanges().forEach(change => {
  //                     const doc = change.doc.data()
  //                     doc.uid = change.doc.id
  //                     if (change.type === 'added' || change.type === 'modified') {
  //                         this.handleAdd(doc)
  //                     }
  //                     if (change.type === 'removed') {
  //                         this.handleRemove(doc.uid)
  //                     }
  //                 })
  //             })
  //         })
  // }
  //
  // handleRemove(docId) {
  //     this._list.delete(docId)
  // }
  //
  // handleAdd(doc) {
  //     const item = new Model(doc)
  //     if (this._list.has(doc.uid)) {
  //         if (JSON.stringify(item) !== JSON.stringify(this._list.get(doc.uid)))
  //             this._list.set(doc.uid, item)
  //     } else this._list.set(doc.uid, item)
  // }
  getItemById = async id => {
    // this.data = this._list.get(id)
    // if (this.data) return this.data
    try {
      const user = await firestore
        .collection(this.#collection)
        .doc(id)
        .get()
        .then(doc => doc.exists && {id: doc.id, ...doc.data()})
        .catch(error => this.stores.SystemMessageStore.handleError(error))
      this._list.set(id, new Model(user))
      this.status = 'ready'
    } catch (error) {
      this.status = 'error'
      console.error(error)
    }
  }

  getItemBySlug = async username => {
    if (!username) return
    try {
      const uid = username.match(/^.{5,22}$/)
        ? await firestore
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
      const user = await firestore
        .collection(this.#collection)
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
}
