const firebase = require('./firebase')
require('firebase/functions')
const db = require('./db')

const functions = firebase.app.functions()
functions.useEmulator('localhost', 5001)

module.exports = {
  functions: functions,

  registerCreator: async () => {
    await db.setInvitation()
    const reg = functions.httpsCallable('registerCreator')
    await reg({
      email: 'creator@emulator.com',
      password: 'creator',
      code: '123abc',
      username: 'emulatedCreator'
    })
      .catch(err => {
        console.error(err)
      })
  },

  registerSupporter: async () => {
    await db.setInvitation()
    const reg = functions.httpsCallable('registerSupporter')
    await reg({
      email: 'supporter@emulator.com',
      password: 'supporter',
      code: '123abc',
      username: 'emulatedSupporter'
    })
      .catch(err => {
        console.error(err)
      })
  }
}
