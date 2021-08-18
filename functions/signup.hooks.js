const functions = require('firebase-functions')
const admin = require('firebase-admin')

const auth = admin.auth()
const database = admin.database()
const firestore = admin.firestore()

// SIGN UP HOOK
// =============================================================================
exports.hook = functions.auth.user().onCreate(async (user) => {
  console.log('onCreate hook')
  // Check if user meets role criteria.
  if (user.email && user.email.endsWith('goker@kodkafa.com')) {
    const customClaims = {admin: true}
    // Set custom user claims on this newly created user.
    await auth.setCustomUserClaims(user.uid, customClaims)
        .then(() => {
        // Update real-time database to notify client to force refresh.
          const metadataRef = database.ref('metadata/' + user.uid)
          firestore.collection('users').doc(user.uid)
              .update({customClaims})
              .catch((error) => {
                console.log('customClaims', error)
              })
          // Set the refresh time to the current UTC timestamp.
          // This will be captured on the client to force a token refresh.
          return metadataRef.set({refreshTime: new Date().getTime()})
        })
        .catch((error) => {
          console.log(error)
        })
  } else return true
})
