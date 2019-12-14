import {DATA, ERROR, FILE, HIDE_MESSAGE, SHOW_MESSAGE, SUCCESS} from "actions/Types";

export const showMessage = (message) => {
  return {
    type: SHOW_MESSAGE,
    payload: message
  };
};
export const hideMessage = () => {
  console.log('action hide message');
  return {
    type: HIDE_MESSAGE,
  };
};
export const systemSuccess = (payload) => {
  return {
    type: SUCCESS,
    payload
  };
};
export const systemError = (payload) => {
  console.log('action error', {payload});
  return {
    type: ERROR,
    payload
  };
};
export const systemData = (payload) => {
  return {
    type: DATA,
    payload
  };
};
export const systemFile = (payload) => {
  return {
    type: FILE,
    payload
  };
};
