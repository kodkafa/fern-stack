//import firebase from "firebase";
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/firestore';
import 'firebase/functions';
import 'firebase/storage';
import {stores} from '../stores';
import {config} from './config';

firebase.initializeApp(config);
const auth = firebase.auth();
const functions = firebase.functions();
if (process.env.NODE_ENV === 'development') {
  functions.useFunctionsEmulator('http://localhost:5001');
}
const APIURL = (process.env.NODE_ENV === 'development') ? 'http://localhost:5001/kodkafa-firebase/us-central1' : '';
stores.AuthStore.handleAuth();

// const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
// const facebookAuthProvider = new firebase.auth.FacebookAuthProvider();
// const githubAuthProvider = new firebase.auth.GithubAuthProvider();
// const twitterAuthProvider = new firebase.auth.TwitterAuthProvider();

export {
  APIURL,
  auth,
  // googleAuthProvider,
  // githubAuthProvider,
  // facebookAuthProvider,
  // twitterAuthProvider
};

