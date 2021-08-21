import {firebase} from '../firebase/initialize'

export class _Base {
  #createdAt = new Date()
  #updatedAt = this.#createdAt
  constructor(data = {}) {
    this.id = data.id || 0
    // ... the others comes from sub classes
    this.#createdAt = data.createdAt || this.#createdAt
    this.#updatedAt = data.updatedAt || this.#updatedAt
    this.author = data.author || {}
    this.status = data.status || 'draft'
  }

  get createdAt() {
    return this.#createdAt instanceof firebase.firestore.Timestamp
      ? this.#createdAt.toDate()
      : this.#createdAt
  }

  set createdAt(date) {
    this.#createdAt = date
  }

  get updatedAt() {
    return this.#updatedAt instanceof firebase.firestore.Timestamp
      ? this.#updatedAt.toDate()
      : this.#updatedAt
  }

  set updatedAt(date) {
    this.#updatedAt = date
  }

  toString = () =>
    JSON.stringify(
      this
      //(k, v) => v !== null ? v : undefined
    )
  static toFirestore = item => ({
    ...JSON.parse(JSON.stringify(item)),
    createdAt: firebase.firestore.Timestamp.fromDate(item.createdAt),
    updatedAt: firebase.firestore.Timestamp.fromDate(item.updatedAt),
  })
  static fromFirestore = (snapshot, options) => {
    const data = snapshot.data(options)
    return new _Base(data)
  }

  // save = async () => {
  //   const {id, ...data} = this
  //   console.log({id, data})
  //   await firebase
  //     .firestore()
  //     .collection(this.constructor.name)
  //     .doc(id)
  //     .update(data)
  //     .then()
  //     .catch(error => stores.SystemMessageStore.handleError(error))
  // }
}
