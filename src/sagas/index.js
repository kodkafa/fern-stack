import {all} from "redux-saga/effects";
import System from "./System";
import Auth from "./Auth";
import User from "./User";

export default function* rootSaga(getState) {
  yield all([
    System(),
    Auth(),
    User(),
  ]);
}
