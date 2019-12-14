import {all, fork, put, takeEvery} from "redux-saga/effects";

import {HIDE_MESSAGE} from "actions/Types";
import {systemError} from "actions/System";


function* hideMessage() {
  yield put(systemError(false));
}

export function* hideSystemMessage() {
  yield takeEvery(HIDE_MESSAGE, hideMessage);
}

export default function* rootSaga() {
  yield all([fork(hideSystemMessage)]);
}
