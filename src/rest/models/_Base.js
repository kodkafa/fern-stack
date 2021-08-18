import {firebase} from 'rest/firebase/initialize'
import {stores} from 'rest/stores'
import uuid from 'react-uuid'

export class _Base {
  constructor(data = {}) {
    this.id = data.id || uuid()
    // ... the others comes from sub classes
    this.createdAt = data.createdAt || new Date()
    this.updatedAt = data.updatedAt || this.createdAt
    this.author = data.author || {}
    this.status = data.status || 'draft'
  }

  toString = () => JSON.stringify(this)
  static toFirestore = item => JSON.parse(JSON.stringify(item))
  static fromFirestore = (snapshot, options) => {
    const data = snapshot.data(options)
    return new _Base(data)
  }

  save = async () => {
    const {id, ...data} = this
    console.log({id, data})
    await firebase
      .firestore()
      .collection(this.constructor.name)
      .doc(id)
      .update(data)
      .then()
      .catch(error => stores.SystemMessageStore.handleError(error))
  }
}
