const express = require('express')
const cors = require('cors') // ({origin: true});
const functions = require('firebase-functions')
const admin = require('firebase-admin')
const {
  authorization,
  isAdmin,
  isEditor,
} = require('./authorization')
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

const db = admin.firestore()

// USERS
// =============================================================================
const users = express()
users.use(cors({origin: true}))
users.use(authorization)
users.get('/', (req, res) => {
  try {
    const nextPageToken = req.params.nextPageToken
    admin
        .auth()
        .listUsers(100, nextPageToken)
        .then((result) => {
          console.log({result})
          return res.end(JSON.stringify(result.users))
        })
  } catch (error) {
    console.log('Error', error.errorInfo)
    return res.status(500).end(JSON.stringify(error.errorInfo))
  }
})
users.get('/:id', isEditor, (req, res) => {
  try {
    // console.log('CLAIMS', req.claims);
    admin.auth().getUser(req.params.id)
        .then((result) => res.end(JSON.stringify(result)))
  } catch (error) {
    console.log('Error', error.errorInfo)
    return res.status(500).end(JSON.stringify(error.errorInfo))
  }
})
users.delete('/:id/delete', isAdmin, (req, res) => {
  try {
    const user = admin.auth().getUserByEmail(req.body.email).end()
    console.log('getUserByEmail', {user})
    if (user) {
      user.delete().end()
      return res
          .status(200)
          .end(
              JSON.stringify({
                code: 'user-deleted',
                message: 'User successfully deleted!',
              }))
    } else {
      // eslint-disable-next-line max-len
      return res.status(404).end(JSON.stringify({code: 'user-not-found', message: 'User not found!'}))
    }
  } catch (error) {
    console.log('Error', error.errorInfo)
    return res.status(500).end(JSON.stringify(error.errorInfo))
  }
})
users.put('/:id/toggleClaim', (req, res) => {
  try {
    admin
        .auth()
        .getUser(req.params.id)
        .then((result) => {
          const user = result.toJSON()
          if (user) {
            // eslint-disable-next-line no-prototype-builtins
            if (req.body.hasOwnProperty('disable')) {
              db.collection('users')
                  .doc(user.uid)
                  .update({disabled: req.body.disable})
                  .catch((error) => {
                    console.log('disable', error)
                  })
              return res.status(200).end(JSON.stringify(user))
            }

            admin
                .auth()
                .setCustomUserClaims(user.uid, req.body)
                .then(() => {
                  // eslint-disable-next-line max-len
                  const metadataRef = admin.database().ref('metadata/' + user.uid)
                  // eslint-disable-next-line max-len
                  metadataRef.set({refreshTime: new Date().getTime()}).then(()=>{
                    // eslint-disable-next-line max-len
                    console.log('user.customClaims', user.customClaims, req.body)
                    if (!req.body) delete user.customClaims
                    // eslint-disable-next-line max-len
                    // else if (user.hasOwnProperty('customClaims') && user.customClaims)
                    //   for (const key in req.body)
                    //     user.customClaims[key] = req.body[key];
                    else user.customClaims = req.body

                    console.log('user.customClaims', user.customClaims)
                    db.collection('users')
                        .doc(user.uid)
                        .update({customClaims: user.customClaims})
                        .catch((error) => {
                          console.log('customClaims', error)
                        })
                    return res.status(200).end(JSON.stringify(user))
                  })
                })
                .catch((error) => {
                  console.log('setCustomUserClaims', error)
                })
          } else {
            return res
                .status(404)
            // eslint-disable-next-line max-len
                .end(JSON.stringify({code: 'user-not-found', message: 'User not found!'}))
          }
        })
        .catch((error) => {
          console.log('User Not Found', error)
          return res
              .status(404)
          // eslint-disable-next-line max-len
              .end(JSON.stringify({code: 'not_found', message: 'User not found!'}))
        })
  } catch (error) {
    console.log('Error', error)
    return res.status(500).end(JSON.stringify(error.errorInfo))
  }
})
exports.functions = functions.https.onRequest(users)
