const express = require('express');
const cors = require('cors');//({origin: true});
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

const db = admin.firestore();

const authorization = async (req, res, next) => {
  const token = req.get('authorization').replace('Bearer ', '');
  return await admin.auth().verifyIdToken(token)
    .then(claims => {
      console.log('Authorization', claims);
      req.claims = claims;
      return next();
    }).catch(error => {
      console.log('Authorization Error', error);
      return res.status(403).end(JSON.stringify({code: 'access_denied', message: 'Access denied!'}));
    })
};

// ACCESS CHECK FUNCTIONS
// =====================================================================================================================
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

exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});

// SIGN UP HOOK
// =====================================================================================================================
exports.processSignUp = functions.auth.user().onCreate((user) => {
  // Check if user meets role criteria.
  if (user.email && user.email.endsWith('@cebeci.name')) {
    const customClaims = {
      admin: true,
      accessLevel: 8
    };
    // Set custom user claims on this newly created user.
    admin.auth().setCustomUserClaims(user.uid, customClaims)
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
  return true;
});

// USERS
// =====================================================================================================================
const users = express();
users.use(cors({origin: true}));
users.use(authorization);
users.get('/', async (req, res) => {
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
users.put('/:id/toggleClaim', async (req, res) => {
  try {
    const user = await admin.auth().getUser(req.params.id)
      .then(user => user.toJSON())
      .catch(error => {
        console.log('User Not Found', error);
        return res.status(404).end(JSON.stringify({code: 'not_found', message: 'User not found!'}));
      });
    if (user) {
      if (req.body.hasOwnProperty('disable')) {
        db.collection("users").doc(user.uid)
          .update({disabled: req.body.disable})
          .catch(error => {
            console.log('disable', error);
          });
        return res.status(200).end(JSON.stringify(user));
      }

      await admin.auth().setCustomUserClaims(user.uid, req.body).then().catch(error => {
        console.log('setCustomUserClaims', error);
      });
      const metadataRef = await admin.database().ref("metadata/" + user.uid);
      metadataRef.set({refreshTime: new Date().getTime()});
      console.log('user.customClaims', user.customClaims, req.body);
      if (!req.body)
        delete user.customClaims;
        // else if (user.hasOwnProperty('customClaims') && user.customClaims)
        //   for (const key in req.body)
      //     user.customClaims[key] = req.body[key];
      else
        user.customClaims = req.body;

      console.log('user.customClaims', user.customClaims);
      db.collection("users").doc(user.uid)
        .update({customClaims: user.customClaims})
        .catch(error => {
          console.log('customClaims', error);
        });
      return res.status(200).end(JSON.stringify(user));
    } else
      return res.status(404).end(JSON.stringify({code: 'user-not-found', message: "User not found!"}));
  } catch (error) {
    console.log('Error', error);
    return res.status(500).end(JSON.stringify(error.errorInfo));
  }
});
exports.users = functions.https.onRequest(users);

