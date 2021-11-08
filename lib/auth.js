const firebase = require('./firebase')
require('firebase/auth')

console.log('\n Starting auth... \n')
const auth = firebase.app.auth()

module.exports = {
  auth: auth,

  signInCreator: async () => {
    const user = await auth.signInWithEmailAndPassword('creator@emulator.com', 'creator')
    return user.user
  },

  signInSupporter: async () => {
    const user = await auth.signInWithEmailAndPassword('supporter@emulator.com', 'supporter')
    return user.user
  },

  anonymous: () => {
    console.log('\n Continuing without sign-in... \n')
    return
  }
}
