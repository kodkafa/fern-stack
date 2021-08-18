const admin = require('firebase-admin')

exports.authorization = (req, res, next) => {
  const token = req.get('authorization').replace('Bearer ', '')
  admin.auth().verifyIdToken(token)
      .then((claims) => {
        console.log('Authorization', claims)
        req.claims = claims
        return next()
      }).catch((error) => {
        console.log('Authorization Error', error)
        // eslint-disable-next-line max-len
        return res.status(403).end(JSON.stringify({code: 'access_denied', message: 'Access denied!'}))
      })
}

// ACCESS CHECK FUNCTIONS
// eslint-disable-next-line max-len
// =====================================================================================================================
exports.isAdmin = (req, res, next) => {
  return req.claims['admin'] ?
    next() :
    // eslint-disable-next-line max-len
    res.status(403).end(JSON.stringify({code: 'access_denied', message: 'Admin permission has not been granted!'}))
}
exports.isEditor = (req, res, next) => {
  return (req.claims['admin'] || req.claims['editor']) ?
    next() :
    // eslint-disable-next-line max-len
    res.status(403).end(JSON.stringify({code: 'access_denied', message: 'Editor permission has not been granted!'}))
}
exports.isManager = (req, res, next) => {
  // eslint-disable-next-line max-len
  return (req.claims['admin'] || req.claims['editor'] || req.claims['manager']) ?
    next() :
    // eslint-disable-next-line max-len
    res.status(403).end(JSON.stringify({code: 'access_denied', message: 'Manager permission has not been granted!'}))
}
exports.isWorker = (req, res, next) => {
// eslint-disable-next-line max-len
  return (req.claims['admin'] || req.claims['editor'] || req.claims['manager'] || req.claims['worker']) ?
    next() :
    // eslint-disable-next-line max-len
    res.status(403).end(JSON.stringify({code: 'access_denied', message: 'Worker permission has not been granted!'}))
}
