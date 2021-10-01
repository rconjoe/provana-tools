const admin = require('firebase-admin')
admin.initializeApp({ projectId: 'db-abstract' })
if (process.env.NODE_ENV !== 'production') {
  process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080'
  process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099'
}
const clientauth = require('./auth')
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
    let creator
    const m = await clientauth.auth.fetchSignInMethodsForEmail('creator@emulator.com')
    if (m.length === 0) {
      let authCreator = await auth.createUser({
        email: 'creator@emulator.com',
        password: 'creator',
        displayName: 'emulatedCreator'
      })
      await auth.setCustomUserClaims(authCreator.uid, { type: 'creators' })
      creator = {
        uid: authCreator.uid,
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
      }
      await auth.setCustomUserClaims(authCreator.uid, { type: 'creators' })
      await fs.collection('creators').doc(authCreator.uid).set(creator)
    }
    else {
      let authCreator = await auth.getUserByEmail('creator@emulator.com')
      let q = await fs.collection('creators').doc(authCreator.uid).get()
      if (!q.exists) {
        creator = {
          uid: authCreator.uid,
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
        }
        await fs.collection('creators').doc(authCreator.uid).set(creator)
      }
      else {
        creator = q.data()
      }
    }
    return creator
  },

  mockSupporter: async () => {
    let supporter
    const m = await clientauth.auth.fetchSignInMethodsForEmail('supporter@emulator.com')
    if (m.length === 0) {
      let authSupporter = await auth.createUser({
        email: 'supporter@emulator.com',
        password: 'supporter',
        displayName: 'emulatedSupporter'
      })
      await auth.setCustomUserClaims(authSupporter.uid, { type: 'supporters' })
      supporter = {
        uid: authSupporter.uid,
        customer: 'cus_123',
        email: 'supporter@emulator.com',
        username: 'emulatedSupporter',
        timezone: 'America/New_York',
        avatar: 'http://placekitten.com/400/400',
        banner: 'http://placekitten.com/400/400',
        online: false
      }
      await fs.collection('supporters').doc(supporter.uid).set(supporter)
    }
    else {
      let authSupporter = await auth.getUserByEmail('supporter@emulator.com')
      let q = await fs.collection('creators').doc(authSupporter.uid).get()
      if (!q.exists) {
        supporter = {
          uid: authSupporter.uid,
          customer: 'cus_123',
          email: 'supporter@emulator.com',
          username: 'emulatedSupporter',
          timezone: 'America/New_York',
          avatar: 'http://placekitten.com/400/400',
          banner: 'http://placekitten.com/400/400',
          online: false
        }
        await fs.collection('supporters').doc(supporter.uid).set(supporter)
      }
      else {
        supporter = q.data()
      }
    }
    return supporter
  },

  mockService: async (slots, mandatoryFill) => {
    let creator = await module.exports.mockCreator()
    let svcRef = fs
      .collection('services')
      .doc()
    let service = {
      id: svcRef.id,
      serviceName: 'emulatedService',
      serviceDescription: 'Made by provana-tools',
      serviceCost: 23,
      serviceLength: 60,
      tags: ['cats', 'womp', 'gleep'],
      color: 'blue',
      software: 'Vim',
      attendees: slots,
      mandatoryFill: mandatoryFill,
      sessionDocIdArray: [],
      uid: creator.uid,
      stripePrice: 'price_123',
      active: true,
    }
    await svcRef.set(service)
    return { service, creator }
  },

}
