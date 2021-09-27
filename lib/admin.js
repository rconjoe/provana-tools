const admin = require('firebase-admin')
admin.initializeApp({ projectId: 'db-abstract' })
if (process.env.NODE_ENV !== 'production') {
  process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080'
  process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099'
}
const auth = admin.auth()
const fs = admin.firestore()
fs.settings({
  host: 'localhost:8080',
  ssl: false
})

module.exports = {
  admin: admin,
  auth: auth,
  fs: fs,

  mockCreator: async () => {
    const user = await auth.createUser({
      email: 'creator@emulator.com',
      password: 'creator',
      displayName: 'emulatedCreator'
    })
    await auth.setCustomUserClaims(user.uid, { type: 'creators' })
    await fs.collection('creators').doc(user.uid).set({
      uid: user.uid,
      customer: 'cus_123',
      account: 'acc_123',
      onboarded: true,
      partner: true,
      email: 'creator@emulator.com',
      temp: '',
      code: '123abc',
      username: 'emulatedCreator',
      timezone: 'America/New_York',
      avatar: 'http://placekitten.com/400/400',
      banner: 'http://placekitten.com/400/400',
      twitter: 'twitter',
      twitch: 'twitch',
      youtube: 'youtube',
      facebook: 'facebook',
      online: false
    })
    return user
  },

  mockSupporter: async () => {
    const user = await auth.createUser({
      email: 'supporter@emulator.com',
      password: 'supporter',
      displayName: 'emulatedsupporter'
    })
    await auth.setCustomUserClaims(user.uid, { type: 'supporters' })
    await fs.collection('supporters').doc(user.uid).set({
      uid: user.uid,
      customer: 'cus_123',
      onboarded: true,
      email: 'supporter@emulator.com',
      temp: '',
      username: 'emulatedSupporter',
      timezone: 'America/New_York',
      avatar: 'http://placekitten.com/400/400',
      banner: 'http://placekitten.com/400/400',
      twitter: 'twitter',
      twitch: 'twitch',
      youtube: 'youtube',
      facebook: 'facebook',
      online: false
    })
    return user
  },
}
