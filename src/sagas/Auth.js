import {all, call, fork, put, takeEvery} from "redux-saga/effects";
//import firebase from "firebase";
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

import {UserModel} from 'models/UserModel';
// import {
//   auth,
//   facebookAuthProvider,
//   githubAuthProvider,
//   googleAuthProvider,
//   twitterAuthProvider
// } from "firebase/initialize";
import {
  AUTH_USER,
  RE_AUTH,
  REGISTER,
  SIGNIN_FACEBOOK_USER,
  SIGNIN_GITHUB_USER,
  SIGNIN_GOOGLE_USER,
  SIGNIN_TWITTER_USER,
  SIGNOUT_USER
} from "actions/Types";
import {auth} from "actions/Auth";
import {showMessage, systemError, systemSuccess} from "actions/System";
// import {userSignInSuccess, userSignOutSuccess, userSignUpSuccess} from "actions/Auth";
// import {
//   userFacebookSignInSuccess,
//   userGithubSignInSuccess,
//   userGoogleSignInSuccess,
//   userTwitterSignInSuccess
// } from "actions/Auth";
const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
const facebookAuthProvider = new firebase.auth.FacebookAuthProvider();
const githubAuthProvider = new firebase.auth.GithubAuthProvider();
const twitterAuthProvider = new firebase.auth.TwitterAuthProvider();

const createUserWithEmailPasswordRequest = async (email, password) =>
  await firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(authUser => authUser)
    .catch(error => error);


const getUserData = async (user) => {
  console.log('getUserData', {user});
  if (!user) return false;
  const metadataRef = await firebase.database().ref('metadata/' + user.uid + '/refreshTime');
  const callback = () => user.getIdToken(true);
  // // Remove previous listener.
  // if (callback) {
  //   metadataRef.off('value', callback);
  // }
  // Subscribe new listener to changes on that node.
  metadataRef.on('value', callback);
  return await firebase.auth().currentUser.getIdTokenResult()
    .then(result => {
      return new UserModel({...user, customClaims:result.claims})
      // return {
      //   user: {
      //     uid: user.uid,
      //     displayName: user.displayName,
      //     email: user.email,
      //     emailVerified: user.emailVerified,
      //     photoUrl: user.photoURL,
      //     claims: result.claims
      //   }
      // }
    })
    .catch(error => error);
};
const signInUserWithEmailPasswordRequest = async (email, password) =>
  await firebase.auth().signInWithEmailAndPassword(email, password)
    .then(async result => await getUserData(result.user))
    .catch(error => error);

const handleAuthRequest = async () =>
  await new Promise(function (resolve, reject) {
    firebase.auth().onAuthStateChanged(async user => {
      resolve(await getUserData(user))
    })
  });

const signOutRequest = async () =>
  await firebase.auth().signOut()
    .then(authUser => authUser)
    .catch(error => error);


const signInUserWithGoogleRequest = async () =>
  await firebase.auth().signInWithPopup(googleAuthProvider)
    .then(authUser => authUser)
    .catch(error => error);

const signInUserWithFacebookRequest = async () =>
  await firebase.auth().signInWithPopup(facebookAuthProvider)
    .then(authUser => authUser)
    .catch(error => error);

const signInUserWithGithubRequest = async () =>
  await firebase.auth().signInWithPopup(githubAuthProvider)
    .then(authUser => authUser)
    .catch(error => error);

const signInUserWithTwitterRequest = async () =>
  await firebase.auth().signInWithPopup(twitterAuthProvider)
    .then(authUser => authUser)
    .catch(error => error);

function* createUserWithEmailPassword({payload}) {
  const {email, password} = payload;
  try {
    const signUpUser = yield call(createUserWithEmailPasswordRequest, email, password);
    if (signUpUser.message) {
      yield put(systemError(signUpUser));
    } else {
      localStorage.setItem('user_id', signUpUser.user.uid);
      yield put(systemSuccess(signUpUser.user.uid));
    }
  } catch (e) {
    yield put(systemError(e));
  }
}

function* signInUserWithGoogle() {
  try {
    const signUpUser = yield call(signInUserWithGoogleRequest);
    if (signUpUser.message) {
      yield put(showMessage(signUpUser.message));
    } else {
      localStorage.setItem('user_id', signUpUser.user.uid);
      yield put(systemSuccess(signUpUser.user.uid));
    }
  } catch (error) {
    yield put(showMessage(error));
  }
}


function* signInUserWithFacebook() {
  try {
    const signUpUser = yield call(signInUserWithFacebookRequest);
    if (signUpUser.message) {
      yield put(showMessage(signUpUser.message));
    } else {
      localStorage.setItem('user_id', signUpUser.user.uid);
      yield put(systemSuccess(signUpUser.user.uid));
    }
  } catch (error) {
    yield put(showMessage(error));
  }
}


function* signInUserWithGithub() {
  try {
    const signUpUser = yield call(signInUserWithGithubRequest);
    if (signUpUser.message) {
      yield put(showMessage(signUpUser.message));
    } else {
      localStorage.setItem('user_id', signUpUser.user.uid);
      yield put(systemSuccess(signUpUser.user.uid));
    }
  } catch (error) {
    yield put(showMessage(error));
  }
}


function* signInUserWithTwitter() {
  try {
    const signUpUser = yield call(signInUserWithTwitterRequest);
    if (signUpUser.message) {
      if (signUpUser.message.length > 100) {
        yield put(showMessage('Your request has been canceled.'));
      } else {
        yield put(showMessage(signUpUser.message));
      }
    } else {
      localStorage.setItem('user_id', signUpUser.user.uid);
      yield put(systemSuccess(signUpUser.user.uid));
    }
  } catch (error) {
    yield put(showMessage(error));
  }
}

function* signInUserWithEmailPassword({payload}) {
  const {email, password} = payload;
  try {
    const result = yield call(signInUserWithEmailPasswordRequest, email, password);
    //console.log('signInUserWithEmailPassword', result);
    if (result && result.hasOwnProperty('message')) {
      yield put(systemError(result));
    } else {
      //localStorage.setItem('user_id', result.user.uid);
      yield put(auth(result));
    }
  } catch (e) {
    yield put(systemError(e));
  }
}

function* checkAuth() {
  try {
    // yield  handleAuthRequest((user) => {
    //   if (user) {
    //     console.log('checkAuth', {user});
    //     put(auth(user));
    //   }
    // });
    const user = yield call(handleAuthRequest);//call(handleAuthRequest);
    console.log('checkAuth', {user});
    yield put(auth(user))
    // console.log('checkAuth', {user});
    // console.log({result});
    // if (result && result.hasOwnProperty('message')) {
    //   yield put(systemError(result));
    // } else if (result) {
    //   localStorage.setItem('user_id', result.uid);
    //   yield put(systemSuccess(result.uid));
    // }
  } catch (e) {
    yield put(systemError(e));
  }
}

function* signOut() {
  try {
    const signOutUser = yield call(signOutRequest);
    if (signOutUser === undefined) {
      localStorage.removeItem('user_id');
      yield put(systemSuccess(signOutUser));
    } else {
      yield put(showMessage(signOutUser.message));
    }
  } catch (error) {
    yield put(showMessage(error));
  }
}

export function* createUserAccount() {
  yield takeEvery(REGISTER, createUserWithEmailPassword);
}

export function* signInWithGoogle() {
  yield takeEvery(SIGNIN_GOOGLE_USER, signInUserWithGoogle);
}

export function* signInWithFacebook() {
  yield takeEvery(SIGNIN_FACEBOOK_USER, signInUserWithFacebook);
}

export function* signInWithTwitter() {
  yield takeEvery(SIGNIN_TWITTER_USER, signInUserWithTwitter);
}

export function* signInWithGithub() {
  yield takeEvery(SIGNIN_GITHUB_USER, signInUserWithGithub);
}

export function* signInUser() {
  yield takeEvery(AUTH_USER, signInUserWithEmailPassword);
}

export function* handleAuth() {
  yield takeEvery(RE_AUTH, checkAuth);
}

export function* signOutUser() {
  yield takeEvery(SIGNOUT_USER, signOut);
}

export default function* rootSaga() {
  yield all([fork(signInUser),
    fork(createUserAccount),
    fork(handleAuth),
    fork(signInWithGoogle),
    fork(signInWithFacebook),
    fork(signInWithTwitter),
    fork(signInWithGithub),
    fork(signOutUser)]);
}
