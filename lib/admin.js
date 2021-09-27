var admin = require('firebase-admin')
admin.initializeApp({ projectId: 'db-abstract' })
var auth = admin.auth()
var fs = admin.firestore()

module.exports = {
  admin: admin,
  auth: auth,
  fs: fs,

  mockCreator: async () => {
    const user = await auth.createUser({
      email: 'creator@emulator.com',
      password: 'creator',
      username: 'emulatedCreator'
    })
    await auth.setCustomUserClaims(user.uid, { type: 'creators' })
    await fs.collection('creators').doc(user.uid).set({
      uid: uid,
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
      username: 'emulatedsupporter'
    })
    await auth.setCustomUserClaims(user.uid, { type: 'supporters' })
    await fs.collection('supporters').doc(user.uid).set({
      uid: uid,
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
