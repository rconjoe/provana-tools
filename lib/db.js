const firebase = require('./firebase')
require('firebase/firestore')
const dayjs = require('dayjs')

console.log('\nStarting Firestore...\n')
const db = firebase.app.firestore()
db.useEmulator('localhost', 8080)

const now = dayjs().unix()

module.exports = {
  db: db,

  setInvitation: async () => {
    await db.collection('invitations')
      .doc('13371337')
      .set({
        id: '13371337',
        code: '123abc',
        generated: now,
        valid: true,
        uid: ''
      })
  },

  fetchCreator: async(uid) => {
    const creator = await db
      .collection('creators')
      .doc(uid)
      .get()
    return creator.data()
  },

  fetchSupporter: async(uid) => {
    const supporter = await db
      .collection('supporters')
      .doc(uid)
      .get()
    return supporter.data()
  },

  writeCreator: async (uid) => {
    await db
      .collection('creators')
      .doc(uid)
      .set({
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
  },

  writeSupporter: async (uid) => {
    await db
      .collection('supporters')
      .doc(uid)
      .set({
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
  },

  writePotential: async (uid) => {
    console.log('Simulating potential session creation...')
    return await db
      .collection('sessions')
      .doc('12345')
      .set({
        sellerUid: uid,
        slots: 3,
        booked: 0,
        serviceDocId: '123',
        mandatoryFill: false,
        name: 'emulated',
        color: 'grey',
        serviceColor: 'blue',
        start: 300 + now,
        end: 7200 + now,
        id: '12345',
        status: 'potential'
      })
      .then(() => {
        console.log('\n Done. Happy debugging :) \n')
      })
    .catch(err => console.error(err))
  },

  publishSession: async () => {
    console.log('Simulating session publish...')
    return await db
    .collection('sessions')
    .doc('12345')
    .update({
      status: 'published',
      color: 'blue'
    })
      .then(() => {
        console.log('\n Done. Happy debugging :) \n')
      })
    .catch(err => console.error(err))
  },

  checkoutSlot: async () => {
    console.log('Simulating slot checkout...')
    return await db
      .collection('sessions')
      .doc('12345')
      .collection('slots')
      .doc('67890')
      .update({
        buyerUid: '123abc',
        buyerUsername: 'test',
        paymentIntent: 'pi_123',
        status: 'holding'
      })
      .then(() => {
        console.log('\n Done. Happy debugging :) \n')
      })
    .catch(err => console.error(err))
  }
}
