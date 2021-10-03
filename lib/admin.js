const admin = require('firebase-admin')
admin.initializeApp({ projectId: 'db-abstract' })
if (process.env.NODE_ENV !== 'production') {
  process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080'
  process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099'
}
const clientauth = require('./auth')
const dayjs = require('dayjs')
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

  mockSession: async (status, service) => {
    let now = dayjs().unix()
    let sesRef = fs
      .collection('sessions')
      .doc()
    const session = {
      sellerUid: service.uid,
      slots: service.attendees,
      booked: 0,
      serviceDocId: service.id,
      mandatoryFill: service.mandatoryFill,
      name: service.serviceName,
      color: service.color,
      serviceColor: service.color,
      start: 300 + now,
      end: 1400 + now,
      id: sesRef.id,
      status: status,
    }
    await sesRef.set(session)
    if (status !== 'potential') {
      await fs.collection('chats')
        .doc(session.id)
        .set({
          creator: session.sellerUid,
          title: session.name,
          users: [session.sellerUid]
        })
    }
    return session
  },

  potentialToPublished: async (service) => {
    await fs.collection('sessions')
      .doc(service.id)
      .update({
        color: service.color,
        status: 'published'
      })
      .catch(err => {
        throw new Error(err)
      })
  },

  mockSlotsForSession: async (session, statuses) => {
    const now = dayjs().unix()
    let slots = []
    for(let i=0; i<session.slots; i++) {
      let _status = statuses[i]
      if (_status === 'booked') await module.exports.incrementSession(session.id)
      let slotRef = fs.collection('sessions')
        .doc(session.id)
        .collection('slots')
        .doc()
      let slot = {
        id: slotRef.id,
        name: session.name,
        slot: i + 1,
        slots: session.slots,
        mandatoryFill: session.mandatoryFill,
        start: now + 300,
        end: now + 1400,
        sellerUid: session.sellerUid,
        serviceDocId: session.serviceDocId,
        buyerUid: "",
        buyerUsername: "",
        paymentIntent: "",
        status: _status,
        parentSession: session.id,
      }
      await slotRef.set(slot)
      .catch(err => {
        console.err(err)
      })
      slots.push(slot)
    }
    return slots
  },

  incrementSession: async (sessionId) => {
    await fs.collection('sessions')
      .doc(sessionId)
      .update({
        booked: admin.firestore.FieldValue.increment(1)
      })
  },

  decrementSession: async (sessionId) => {
    await fs.collection('sessions')
      .doc(sessionId)
      .update({
        booked: admin.firestore.FieldValue.increment(-1)
      })
  },

  publishedToFull: async (sessionId) => {
    await fs.collection('sessions')
      .doc(sessionId)
      .update({
        status: 'full'
      })
      .catch(err => {
        throw new Error(err)
      })
  },

  checkoutSlot: async (slot) => {
    await fs.collection('sessions')
      .doc(slot.parentSession)
      .collection('slots')
      .doc(slot.id)
      .update({
        status: 'holding',
        paymentIntent: 'pi_123',
        buyerUid: 'buyer_123',
        buyerUsername: 'emulatedBuyer'
      })
      .catch(err => {
        console.error(err)
      })
  },

  holdingToBooked: async (slot) => {
    await fs.collection('sessions')
      .doc(slot.parentSession)
      .collection('slots')
      .doc(slot.id)
    .update({ status: 'booked' })
      .catch(err => {
        console.error(err)
      })
  },

  slotBookedToActive: async (slot) => {
    await fs.collection('sessions')
      .doc(slot.parentSession)
      .collection('slots')
      .doc(slot.id)
    .update({ status: 'active' })
      .catch(err => {
        console.error(err)
      })
  },

  publishedToActive: async (sessionId) => {
    await fs.collection('sessions')
      .doc(sessionId)
      .update({
        status: 'active'
      })
      .catch(err => {
        throw new Error(err)
      })
  },

  fullToActive: async (sessionId) => {
    await fs.collection('sessions')
      .doc(sessionId)
      .update({
        status: 'active'
      })
      .catch(err => {
        throw new Error(err)
      })
  },

}
