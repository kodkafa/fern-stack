import {USER_LIST,USER_TOGGLE_ADMIN} from "actions/Types";

export const fetchList = (payload) => {
  return {
    type: USER_LIST,
    payload
  };
};

export const toggleAdmin = (payload) => {
  return {
    type: USER_TOGGLE_ADMIN,
    payload
  };
};

