const admin = require('firebase-admin')
admin.initializeApp()

const processSignUp = require('./signup.hooks')
const users = require('./users.functions')

exports.processSignUp = processSignUp.hook
exports.users = users.functions
