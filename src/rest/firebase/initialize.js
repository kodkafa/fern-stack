//import firebase from "firebase";
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/firestore'
import 'firebase/functions'
import 'firebase/storage'
// import {stores} from '../stores';
import {config} from './config'

firebase.initializeApp(config)
const auth = firebase.auth()
const functions = firebase.functions()
const db = firebase.firestore()
if (process.env.NODE_ENV === 'development') {
  functions.useFunctionsEmulator('http://localhost:5001')
}
const APIURL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:5001/kodkafa-firebase/us-central1'
    : 'https://us-central1-kodkafa-firebase.cloudfunctions.net'
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
  functions,
  db,
  // googleAuthProvider,
  // githubAuthProvider,
  // facebookAuthProvider,
  // twitterAuthProvider
}
