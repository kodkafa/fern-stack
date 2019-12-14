import {AUTH, AUTH_ERROR, UNAUTH_USER} from 'actions/Types';

export const reducer = (state = {}, action) => {

  console.log('reducer', {action});
  switch (action.type) {
    case AUTH:
      return {...state, error: '', authenticated: true, me: action.payload};
    case UNAUTH_USER:
      return {...state, authenticated: false, me: false};
    case AUTH_ERROR:
      return {...state, authenticated: false, error: action.payload};
    default:
      return state;
  }
};
