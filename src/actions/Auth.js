import {AUTH, AUTH_USER, RE_AUTH, REGISTER, UNAUTH_USER} from "actions/Types";

export const userSignUp = (user) => {
  return {
    type: REGISTER,
    payload: user
  };
};
export const userSignIn = (user) => {
  console.log('AUTH_USER', user)
  return {
    type: AUTH_USER,
    payload: user
  };
};
export const handleAuth = () => {
  return {
    type: RE_AUTH
  };
};
export const auth = (payload) => {
  console.log('auth action',{payload})
  return {
    type: AUTH,
    payload
  };
};
export const userSignOut = () => {
  return {
    type: UNAUTH_USER
  };
};
// export const userSignUpSuccess = (authUser) => {
//   return {
//     type: SIGNUP_USER_SUCCESS,
//     payload: authUser
//   };
// };
//
// export const userSignInSuccess = (authUser) => {
//   return {
//     type: SIGNIN_USER_SUCCESS,
//     payload: authUser
//   }
// };
// export const userSignOutSuccess = () => {
//   return {
//     type: SIGNOUT_USER_SUCCESS,
//   }
// };
//
// export const showAuthMessage = (message) => {
//   return {
//     type: SHOW_MESSAGE,
//     payload: message
//   };
// };
//
//
// export const userGoogleSignIn = () => {
//   return {
//     type: SIGNIN_GOOGLE_USER
//   };
// };
// export const userGoogleSignInSuccess = (authUser) => {
//   return {
//     type: SIGNIN_GOOGLE_USER_SUCCESS,
//     payload: authUser
//   };
// };
// export const userFacebookSignIn = () => {
//   return {
//     type: SIGNIN_FACEBOOK_USER
//   };
// };
// export const userFacebookSignInSuccess = (authUser) => {
//   return {
//     type: SIGNIN_FACEBOOK_USER_SUCCESS,
//     payload: authUser
//   };
// };
// export const setInitUrl = (url) => {
//   return {
//     type: INIT_URL,
//     payload: url
//   };
// };
// export const userTwitterSignIn = () => {
//   return {
//     type: SIGNIN_TWITTER_USER
//   };
// };
// export const userTwitterSignInSuccess = (authUser) => {
//   return {
//     type: SIGNIN_TWITTER_USER_SUCCESS,
//     payload: authUser
//   };
// };
// export const userGithubSignIn = () => {
//   return {
//     type: SIGNIN_GITHUB_USER
//   };
// };
// export const userGithubSignInSuccess = (authUser) => {
//   return {
//     type: SIGNIN_GITHUB_USER_SUCCESS,
//     payload: authUser
//   };
// };
// export const showAuthLoader = () => {
//   return {
//     type: ON_SHOW_LOADER,
//   };
// };
//
// export const hideMessage = () => {
//   return {
//     type: HIDE_MESSAGE,
//   };
// };
// export const hideAuthLoader = () => {
//   return {
//     type: ON_HIDE_LOADER,
//   };
// };
