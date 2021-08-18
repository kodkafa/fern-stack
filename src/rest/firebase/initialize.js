//import firebase from "firebase";
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/firestore'
import 'firebase/functions'
import 'firebase/storage'

// You should copy your conf. from firebase console
// for more info please read the README.md
import {config} from './config'

firebase.initializeApp(config)
const auth = firebase.auth()
const database = firebase.database()
const firestore = firebase.firestore()
const functions = firebase.functions()
const storage = firebase.storage()

if (process.env.NODE_ENV === 'development') {
  auth.useEmulator('http://localhost:9099')
  database.useEmulator('localhost', 9000)
  firestore.useEmulator('localhost', 8080)
  functions.useEmulator('localhost', 5001)
  storage.useEmulator('localhost', 9199)
}
// not a good hack
const APIURL =
  process.env.NODE_ENV === 'development'
    ? `http://localhost:5001/${config.projectId}/us-central1`
    : `https://us-central1-${config.projectId}.cloudfunctions.net`
// stores.AuthStore.handleAuth();
// console.log(stores.AuthStore.me)

// const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
// const facebookAuthProvider = new firebase.auth.FacebookAuthProvider();
// const githubAuthProvider = new firebase.auth.GithubAuthProvider();
// const twitterAuthProvider = new firebase.auth.TwitterAuthProvider();

export {
  APIURL,
  firebase,
  auth,
  database,
  firestore,
  functions,
  storage,
  // googleAuthProvider,
  // githubAuthProvider,
  // facebookAuthProvider,
  // twitterAuthProvider
}
