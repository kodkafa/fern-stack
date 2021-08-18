const express = require('express')
const cors = require('cors') // ({origin: true});
const functions = require('firebase-functions')
const admin = require('firebase-admin')
const {authorization, isAdmin, isEditor} = require('./authorization')
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

const auth = admin.auth()
const database = admin.database()
const firestore = admin.firestore()

// USERS
// =============================================================================
const users = express()
users.use(cors({origin: true}))
users.use(authorization)
users.get('/', async (req, res) => {
  try {
    const nextPageToken = req.params.nextPageToken
    const result = await auth.listUsers(100, nextPageToken)
    const list = await Promise.all(result.users.map(async (i) => {
      const data = await firestore.collection('users')
          .doc(i.uid).get().then((i)=>i.data())
      return {...data, ...i}
    }))
    return res.end(JSON.stringify(list))
  } catch (error) {
    console.log('Error', error.errorInfo)
    return res.status(500).end(JSON.stringify(error.errorInfo))
  }
})
users.get('/:id', isEditor, async (req, res) => {
  try {
    // console.log('CLAIMS', req.claims);
    const result = await auth.getUser(req.params.id)
    result.map(async (i) => {
      const data = await firestore.collection('users').doc(i.uid).get()
      console.log({data})
      return {...data, ...i}
    })
    return res.end(JSON.stringify(result))
  } catch (error) {
    console.log('Error', error.errorInfo)
    return res.status(500).end(JSON.stringify(error.errorInfo))
  }
})
users.delete('/:id/delete', isAdmin, (req, res) => {
  try {
    const user = auth.getUserByEmail(req.body.email).end()
    console.log('getUserByEmail', {user})
    if (user) {
      user.delete().end()
      return res.status(200).end(
          JSON.stringify({
            code: 'user-deleted',
            message: 'User successfully deleted!',
          }),
      )
    } else {
      return res.status(404).end(
          JSON.stringify({
            code: 'user-not-found',
            message: 'User not found!',
          }),
      )
    }
  } catch (error) {
    console.log('Error', error.errorInfo)
    return res.status(500).end(JSON.stringify(error.errorInfo))
  }
})
users.put('/:id/toggleClaim', async (req, res) => {
  try {
    const user = await auth
        .getUser(req.params.id)
        .then((user) => user.toJSON())
        .catch((error) => {
          console.log('User Not Found', error)
          return res.status(404).end(
              JSON.stringify({
                code: 'not_found',
                message: 'User not found!',
              }),
          )
        })
    if (user) {
      // eslint-disable-next-line no-prototype-builtins
      if (req.body.hasOwnProperty('disable')) {
        await auth.updateUser(user.uid, {disabled: req.body.disable})
        await firestore
            .collection('users')
            .doc(user.uid)
            .update({disabled: req.body.disable})
            .catch((error) => {
              console.log('disable', error)
            })
        user.disabled = req.body.disable
        const metadataRef = await database.ref('metadata/' + user.uid)
        metadataRef.set({refreshTime: new Date().getTime()})
        return res.status(200).end(JSON.stringify(user))
      }

      // update custom  claims
      await auth.setCustomUserClaims(user.uid, req.body).catch((error) => {
        console.log('setCustomUserClaims', error)
      })
      // get updated custom claims from auth
      const customClaims = await auth
          .getUser(user.uid)
          .then((user) => user.customClaims)
      console.log('user.customClaims', req.body, customClaims)
      // update user on firestore
      firestore
          .collection('users')
          .doc(user.uid)
          .update({customClaims})
          .catch((error) => {
            console.log('customClaims', error)
          })
      user.customClaims = customClaims
      const metadataRef = await database.ref('metadata/' + user.uid)
      metadataRef.set({refreshTime: new Date().getTime()})
      return res.status(200).end(JSON.stringify(user))
    } else {
      return res.status(404).end(
          JSON.stringify({
            code: 'user-not-found',
            message: 'User not found!',
          }),
      )
    }
  } catch (error) {
    console.log('Error', error)
    return res.status(500).end(JSON.stringify(error.errorInfo))
  }
})
exports.functions = functions.https.onRequest(users)
