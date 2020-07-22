const admin = require('firebase-admin');

exports.authorization = async (req, res, next) => {
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
exports.isAdmin = (req, res, next) => {
  return req.claims['admin']
    ? next()
    : res.status(403).end(JSON.stringify({code: 'access_denied', message: 'Admin permission has not been granted!'}));
};
exports.isEditor = (req, res, next) => {
  return (req.claims['admin'] || req.claims['editor'])
    ? next()
    : res.status(403).end(JSON.stringify({code: 'access_denied', message: 'Editor permission has not been granted!'}));
};
exports.isManager = (req, res, next) => {
  return (req.claims['admin'] || req.claims['editor'] || req.claims['manager'])
    ? next()
    : res.status(403).end(JSON.stringify({code: 'access_denied', message: 'Manager permission has not been granted!'}));
};
exports.isWorker = (req, res, next) => {
  return (req.claims['admin'] || req.claims['editor'] || req.claims['manager'] || req.claims['worker'])
    ? next()
    : res.status(403).end(JSON.stringify({code: 'access_denied', message: 'Worker permission has not been granted!'}));
};
