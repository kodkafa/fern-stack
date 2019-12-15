const express = require('express');
const cors = require('cors');//({origin: true});
const functions = require('firebase-functions');
const admin = require('firebase-admin');
//console.log('initializeApp', functions.config(), functions.config().firebase);
//admin.initializeApp(functions.config().firebase);
admin.initializeApp();
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

const db = admin.firestore();

const authorization = async (req, res, next) => {
  const token = req.get('authorization').replace('Bearer ', '');
  //console.log('accessControl', token);
  return await admin.auth().verifyIdToken(token)
    .then(claims => {
      //console.log('verifyIdToken', claims.admin, claims[userType], userType);
      console.log('Authorization', claims);
      req.claims = claims;
      return next();
      //return claims[userType]
    }).catch(error => {
      console.log('Authorization Error', error);
      return res.status(403).end(JSON.stringify({code: 'access_denied', message: 'Access denied!'}));
    })
};

const isAdmin = (req, res, next) => {
  return req.claims['admin']
    ? next()
    : res.status(403).end(JSON.stringify({code: 'access_denied', message: 'Admin permission has not been granted!'}));
};
const isEditor = (req, res, next) => {
  return (req.claims['admin'] || req.claims['editor'])
    ? next()
    : res.status(403).end(JSON.stringify({code: 'access_denied', message: 'Editor permission has not been granted!'}));
};
const isManager = (req, res, next) => {
  return (req.claims['admin'] || req.claims['editor'] || req.claims['manager'])
    ? next()
    : res.status(403).end(JSON.stringify({code: 'access_denied', message: 'Manager permission has not been granted!'}));
};
const isWorker = (req, res, next) => {
  return (req.claims['admin'] || req.claims['editor'] || req.claims['manager'] || req.claims['worker'])
    ? next()
    : res.status(403).end(JSON.stringify({code: 'access_denied', message: 'Worker permission has not been granted!'}));
};
//   async (req, res, next) => {
//   const token = req.get('authorization').replace('Bearer ', '');
//   //console.log('accessControl', token);
//   return await admin.auth().verifyIdToken(token)
//     .then(claims => {
//       //console.log('verifyIdToken', claims.admin, claims[userType], userType);
//       console.log('Authorization', claims);
//       req.claims = claims;
//       return next(req)
//       //return claims[userType]
//     }).catch(error => {
//       console.log('Authorization Error', error);
//       return res.status(403).end(JSON.stringify({code: 'access_denied', message: 'Access denied!'}));
//     })
// };

exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});

exports.processSignUp = functions.auth.user().onCreate((user) => {
  // Check if user meets role criteria.
  if (user.email && user.email.endsWith('@cebeci.name')) {
    const customClaims = {
      admin: true,
      accessLevel: 8
    };
    // Set custom user claims on this newly created user.
    return admin.auth().setCustomUserClaims(user.uid, customClaims)
      .then(() => {
        // Update real-time database to notify client to force refresh.
        const metadataRef = admin.database().ref("metadata/" + user.uid);
        // Set the refresh time to the current UTC timestamp.
        // This will be captured on the client to force a token refresh.
        return metadataRef.set({refreshTime: new Date().getTime()});
      })
      .catch(error => {
        console.log(error);
      });
  }
});


const users = express();
users.use(cors({origin: true}));
users.use(authorization);
users.get('/', async (req, res) => {
  console.log('FUNC: USERS --------------------------------------------');
  try {
    const nextPageToken = req.params.nextPageToken;
    const result = await admin.auth().listUsers(100, nextPageToken);
    console.log({result});
    return res.end(JSON.stringify(result.users));
  } catch (error) {
    console.log('Error', error.errorInfo);
    return res.status(500).end(JSON.stringify(error.errorInfo));
  }
});
users.get('/:id', isEditor, async (req, res) => {
  try {
    //console.log('CLAIMS', req.claims);
    const result = await admin.auth().getUser(req.params.id);
    return res.end(JSON.stringify(result));
  } catch (error) {
    console.log('Error', error.errorInfo);
    return res.status(500).end(JSON.stringify(error.errorInfo));
  }
});
// users.put('/:id/toggleAdmin', isAdmin, (req, res) => {
//   try {
//     const user = admin.auth().getUserByEmail(email).end();
//     console.log('getUserByEmail', {user});
//     if (user) {
//       admin.auth().setCustomUserClaims(user.uid, {
//         admin: true
//       }).end();
//       const metadataRef = admin.database().ref("metadata/" + user.uid);
//       metadataRef.set({refreshTime: new Date().getTime()});
//       return res.status(200).end(JSON.stringify(user));
//     } else
//       return res.status(404).end(JSON.stringify({code: 'user-not-found', message: "User not found!"}));
//   } catch (error) {
//     console.log('Error', error.errorInfo);
//     return res.status(500).end(JSON.stringify(error.errorInfo));
//   }
// });
users.delete('/:id/delete', isAdmin, (req, res) => {
  try {
    const user = admin.auth().getUserByEmail(email).end();
    console.log('getUserByEmail', {user});
    if (user) {
      user.delete().end();
      return res.status(200).end(JSON.stringify({code: 'user-deleted', message: "User successfully deleted!"}));
    } else
      return res.status(404).end(JSON.stringify({code: 'user-not-found', message: "User not found!"}));
  } catch (error) {
    console.log('Error', error.errorInfo);
    return res.status(500).end(JSON.stringify(error.errorInfo));
  }
});
users.put('/:id/toggleAdmin', isAdmin, async (req, res) => {
  try {
    const user = await admin.auth().getUser(req.params.id)
      .then(user => user.toJSON())
      .catch(error => {
        console.log('User Not Found', error);
        return res.status(404).end(JSON.stringify({code: 'not_found', message: 'User not found!'}));
      });
    if (user) {
      await admin.auth().setCustomUserClaims(user.uid, {
        admin: req.body.admin// ? req.body.admin : admin.firestore.FieldValue.delete()
      }).then();
      const metadataRef = await admin.database().ref("metadata/" + user.uid);
      metadataRef.set({refreshTime: new Date().getTime()});
      console.log('user.customClaims', typeof user.customClaims);
      if (!req.body.admin)
        delete user.customClaims.admin;
      else if (user.hasOwnProperty('customClaims') && user.customClaims)
        user.customClaims.admin = true;
      else
        user.customClaims = {admin: true};
      db.collection("users").doc(user.uid)
        .update({customClaims: user.customClaims});

      return res.status(200).end(JSON.stringify(user));
    } else
      return res.status(404).end(JSON.stringify({code: 'user-not-found', message: "User not found!"}));
  } catch (error) {
    console.log('Error', error);
    return res.status(500).end(JSON.stringify(error.errorInfo));
  }
});
exports.users = functions.https.onRequest(users);

// exports.toggleAdmin = functions.https.onRequest(async (req, res) => {
//   cors(req, res, () => {
//     // Get the ID token passed.
//     const idToken = req.body.idToken;
//     const email = req.body.email;
//     console.log('headers', JSON.stringify(req.headers));
//     console.log('body', JSON.stringify(req.body));
//     console.log('req', email);
//     console.log('req', idToken);
//     // Verify the ID token and decode its payload.
//     admin.auth().verifyIdToken(idToken)
//       .then((claims) => {
//         console.log('verifyIdToken', claims.admin);
//         if (claims.admin === 'true' || claims.admin === true) {
//           console.log('verifyIdToken', claims.admin);
//           admin.auth().getUserByEmail(email)
//             .then((user) => {
//               console.log('getUserByEmail', {user});
//               admin.auth().setCustomUserClaims(user.uid, {
//                 admin: true
//               })
//                 .then(result => {
//                   console.log({result});
//                   const metadataRef = admin.database().ref("metadata/" + user.uid);
//                   // Set the refresh time to the current UTC timestamp.
//                   // This will be captured on the client to force a token refresh.
//                   metadataRef.set({refreshTime: new Date().getTime()});
//                   return res.end(JSON.stringify({
//                     status: 'success'
//                   }));
//                 })
//                 .catch((error) => {
//                   return res.end(JSON.stringify({status: 'error', error}));
//                 });
//             })
//             .catch((error) => {
//               return res.end(JSON.stringify({status: 'error', error}));
//             });
//         } else
//           return res.end(JSON.stringify({status: 'error', error: {code: 'access-denies', message: 'Access denied'}}));
//
//         //
//         //
//         // // Verify user is eligible for additional privileges.
//         // if (typeof claims.email !== 'undefined' &&
//         //   typeof claims.email_verified !== 'undefined' &&
//         //   claims.email_verified &&
//         //   claims.email.endsWith('@cebeci.name')) {
//         //   // Add custom claims for additional privileges.
//         //   admin.auth().setCustomUserClaims(claims.sub, {
//         //     admin: true
//         //   })
//         //     .then(() => {
//         //       // Tell client to refresh token on user.
//         //       return res.end(JSON.stringify({
//         //         status: 'success'
//         //       }));
//         //     })
//         //     .catch(error => {
//         //       return res.end(JSON.stringify({status: 'error', error}));
//         //     });
//         // }
//         // // Return nothing.
//         // return res.end(JSON.stringify({status: 'ineligible'}));
//
//       })
//       .catch(error => {
//         res.end(JSON.stringify({status: 'error', error}));
//       });
//   })
// });


// admin.auth().verifyIdToken(idToken).then((claims) => {
//   if (claims.admin === true) {
//     // Allow access to requested admin resource.
//   }
// });
//
// // Lookup the user associated with the specified uid.
// admin.auth().getUser(uid).then((userRecord) => {
//   // The claims can be accessed on the user record.
//   console.log(userRecord.customClaims.admin);
// });
//
//
// exports.getUser = functions.https.onRequest(async (req, res) => {
//   cors(req, res, async () => {
//     try {
//       await accessControl('admin', req.get('authorization'));
//
//
//       const nextPageToken = req.body.nextPageToken;
//       //console.log('headers', JSON.stringify(req.headers));
//       //console.log('body', JSON.stringify(req.body));
//
//       const result = await admin.auth().getUser(req.body.id);
//       console.log({result})
//       return res.end(JSON.stringify(result));
//       // .then(result => {
//       //   return res.end(JSON.stringify({
//       //     status: 'success',
//       //     data: result
//       //   }));
//       // })
//       // .catch(error => {
//       //   console.log('Error listing users:', error);
//       //   return res.end(JSON.stringify({status: 'error', error}));
//       // });
//     } catch (error) {
//       console.log('Error', error.errorInfo);
//       return res.status(500).end(JSON.stringify(error.errorInfo));
//     }
//   })
// });
//
//
// exports.listUsers = functions.https.onRequest(async (req, res) => {
//   cors(req, res, async () => {
//
//     const idToken = req.body.idToken;
//     const access = await accessControl('admin', idToken);
//     console.log('Access', access);
//     if (!access) {
//       return res.end(JSON.stringify({status: 'error', error: {code: 'access_denied', message: 'Access denied!'}}));
//     }
//
//     const nextPageToken = req.body.nextPageToken;
//     //console.log('headers', JSON.stringify(req.headers));
//     //console.log('body', JSON.stringify(req.body));
//     admin.auth().listUsers(100, nextPageToken)
//       .then(result => {
//         return res.end(JSON.stringify({
//           status: 'success',
//           data: result.users
//         }));
//       })
//       .catch(error => {
//         console.log('Error listing users:', error);
//         return res.end(JSON.stringify({status: 'error', error}));
//       });
//   })
// });
