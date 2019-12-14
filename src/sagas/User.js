import {all, fork, put, takeEvery} from "redux-saga/effects";

import {USER_LIST, USER_TOGGLE_ADMIN} from "actions/Types";
import {systemData, systemError, systemSuccess} from "actions/System";

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/functions';

const getToken = async () => {
  try {
    return await firebase
      .auth()
      .currentUser.getIdToken(true)
      .then(idToken => {
        console.log({idToken});
        return idToken;
      })
      .catch(e => {
        return false;
      });
  } catch (e) {
    console.log({e})
  }
};

export function* userListRequest(action) {
  const data = action.payload || {};
  const token = yield getToken();
  data.idToken = token;
  console.log(token);
  console.log({data});
  const result = yield fetch('http://localhost:5001/kodkafa-firebase/us-central1/listUsers',
    {
      // credentials: 'include',
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      // credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      // redirect: 'follow', // manual, *follow, error
      // referrer: 'no-referrer', // no-referrer, *client
      body: JSON.stringify(data)
    })
    .then(response => response.json(),);
  if (result.status === 'success')
    yield put(systemData(result.data));
  else
    yield put(systemError(result));
}

export function* toggleAdminRequest(action) {

  // const toggleAdmin = firebase.functions().httpsCallable('toggleAdmin');
  // toggleAdmin({email: 'goker@basepart.com'}).then(function (result) {
  //   // Read result of the Cloud Function.
  //   console.log('firebase function', {result})
  // }).catch(error => console.log({error}));
  const data = action.payload;
  const token = yield getToken();
  data.idToken = token;
  console.log(token);
  console.log({data});
  const result = yield fetch('http://localhost:5001/kodkafa-firebase/us-central1/toggleAdmin',
    {
      // credentials: 'include',
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      // credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      // redirect: 'follow', // manual, *follow, error
      // referrer: 'no-referrer', // no-referrer, *client
      body: JSON.stringify(data)
    })
    .then(response => response.json(),);

  yield put(systemSuccess(result));
}

export default function* rootSaga() {
  yield all([
    yield takeEvery(USER_LIST, userListRequest),
    yield takeEvery(USER_TOGGLE_ADMIN, toggleAdminRequest)
  ]);
}
