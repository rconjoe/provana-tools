const admin = require('firebase-admin')
const tasks = require('./tasks')
admin.initializeApp({ projectId: 'db-abstract' })
if (process.env.NODE_ENV !== 'production') {
  process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080'
  process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099'
}
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

  mockCreator: async (n) => {
    let creators = []
    for (i=1; i<=n.length; i++) {
      let creator
      let authCreator = await auth.createUser({
        email: `creator${i}@emulator.com`,
        password: 'creator',
        displayName: `emulatedCreator${i}`
      })
      await auth.setCustomUserClaims(authCreator.uid, { type: 'creators' })
      creator = {
        uid: authCreator.uid,
        customer: 'cus_123',
        account: 'acc_123',
        onboarded: true,
        partner: true,
        email: `creator${i}@emulator.com`,
        temp: '',
        code: '123abc',
        username: `emulatedCreator${i}`,
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
      await fs.collection('notifications').doc(creator.uid).set({uid: creator.uid})
      creators.push(creator)
    }
    return creators
  },

  mockSupporter: async (n) => {
    let supporters = []
    for (i=1; i<=n.length; i++) {
      let supporter
      let authSupporter = await auth.createUser({
        email: `supporter${i}@emulator.com`,
        password: 'supporter',
        displayName: `emulatedSupporter${i}`
      })
      await auth.setCustomUserClaims(authSupporter.uid, { type: 'supporters' })
      supporter = {
        uid: authSupporter.uid,
        customer: 'cus_123',
        email: `supporter${i}@emulator.com`,
        username: `emulatedSupporter${i}`,
        timezone: 'America/New_York',
        avatar: 'http://placekitten.com/400/400',
        banner: 'http://placekitten.com/400/400',
        online: false
      }
      await fs.collection('supporters').doc(authSupporter.uid).set(supporter)
      await fs.collection('notifications').doc(supporter.uid).set({uid: supporter.uid})
      supporters.push(supporter)
    }
    return supporters
  },

  mockService: async (slots, mandatoryFill) => {
    let creator = await module.exports.mockCreator([1])
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
      uid: creator[0].uid,
      stripePrice: 'price_123',
      active: true,
    }
    await svcRef.set(service)
    return { service, creator: creator[0] }
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
        status: statuses[i],
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

  bookedToCancelled: async (slot) => {
    await fs.collection('sessions')
      .doc(slot.parentSession)
      .collection('slots')
      .doc(slot.id)
      .update({ status: 'cancelled' })
      .catch(err => {
        console.error(err)
      })
  },

  mockSlotPurchase: async (slot, supporter) => {
    let slRef = fs.collection('sessions')
      .doc(slot.parentSession)
      .collection('slots')
      .doc(slot.id)
    await slRef
      .update({
        buyerUid: supporter.uid,
        buyerUsername: supporter.username,
        paymentIntent: 'pi_123',
        status: 'booked'
      })
    await fs.collection('chats').doc(slot.parentSession).update({
      users: admin.firestore.FieldValue.arrayUnion(supporter.uid)
    })
    let task = await tasks.scheduleTask('slot-start', slot.id)
    await fs.collection('tasks').doc(slot.id).set({ task: task })
    let booked = await slRef.get()
    return booked.data()
  },

  cancelSession: async (sessionId) => {
    await fs.collection('sessions')
      .doc(sessionId)
      .update({ status: 'cancelled' })
      .catch(err => {
        console.error(err)
      })
  },

  setPotential: async (service) => {
    let now = dayjs().unix()
    let svc = await fs.collection('services')
      .where('serviceName', '==', service.serviceName)
      .get()
    let sesRef = fs.collection('sessions').doc()
    let potentialSes = {
      name: service.serviceName,
      slots: service.attendees,
      mandatoryFill: service.mandatoryFill,
      color: 'grey',
      serviceColor: service.color,
      start: 300 + now,
      end: 1400 + now,
      sellerUid: service.uid,
      serviceDocId: svc.docs[0].id,
      status: 'potential',
      id: sesRef.id,
    }
    await sesRef.set(potentialSes)
      .catch(err => console.error(err))
    return potentialSes
  }

}
