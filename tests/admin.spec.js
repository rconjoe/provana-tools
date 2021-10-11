require('jest')
require('jest-extended')
const admin = require('../lib/admin')
const util = require('../lib/util')
const clientauth = require('../lib/auth')
const dayjs = require('dayjs')
const db = require("../lib/db")

jest.setTimeout(30000)
describe('Tests Admin SDK module', () => {
  beforeEach(async () => {
    await util.flushDb()
  })
  it('Verifies SDK initialization', () => {
    expect(admin.admin.apps.length).toEqual(1)
    expect(admin.auth).toBeTruthy()
    expect(admin.fs).toBeTruthy()
  })
  it('Tests mockCreator method', async () => {
    await util.flushAuth()
    await admin.mockCreator([1,2,3])
    let m1 = await clientauth.auth.fetchSignInMethodsForEmail('creator1@emulator.com')
    expect(m1.length).toEqual(1)
    let creator1 = await admin.auth.getUserByEmail('creator1@emulator.com')
    expect(creator1.displayName).toBe('emulatedCreator1')
    let fsCreator1 = await admin.fs.collection('creators').doc(creator1.uid).get()
    expect(fsCreator1.data().uid).toEqual(creator1.uid)

    let m2 = await clientauth.auth.fetchSignInMethodsForEmail('creator2@emulator.com')
    expect(m2.length).toEqual(1)
    let creator2 = await admin.auth.getUserByEmail('creator2@emulator.com')
    expect(creator2.displayName).toBe('emulatedCreator2')
    let fsCreator2 = await admin.fs.collection('creators').doc(creator2.uid).get()
    expect(fsCreator2.data().uid).toEqual(creator2.uid)

    let m3 = await clientauth.auth.fetchSignInMethodsForEmail('creator3@emulator.com')
    expect(m3.length).toEqual(1)
    let creator3 = await admin.auth.getUserByEmail('creator3@emulator.com')
    expect(creator3.displayName).toBe('emulatedCreator3')
    let fsCreator3 = await admin.fs.collection('creators').doc(creator3.uid).get()
    expect(fsCreator3.data().uid).toEqual(creator3.uid)
  })
  it('Tests mockSupporter method', async () => {
    await util.flushAuth()
    await admin.mockSupporter([1,2,3])
    let m1 = await clientauth.auth.fetchSignInMethodsForEmail('supporter1@emulator.com')
    expect(m1.length).toEqual(1)
    let supporter1 = await admin.auth.getUserByEmail('supporter1@emulator.com')
    expect(supporter1.displayName).toBe('emulatedSupporter1')
    let fsSupporter1 = await admin.fs.collection('supporters').doc(supporter1.uid).get()
    expect(fsSupporter1.data().uid).toEqual(supporter1.uid)

    let m2 = await clientauth.auth.fetchSignInMethodsForEmail('supporter2@emulator.com')
    expect(m2.length).toEqual(1)
    let supporter2 = await admin.auth.getUserByEmail('supporter2@emulator.com')
    expect(supporter2.displayName).toBe('emulatedSupporter2')
    let fsSupporter2 = await admin.fs.collection('supporters').doc(supporter2.uid).get()
    expect(fsSupporter2.data().uid).toEqual(supporter2.uid)

    let m3 = await clientauth.auth.fetchSignInMethodsForEmail('supporter3@emulator.com')
    expect(m3.length).toEqual(1)
    let supporter3 = await admin.auth.getUserByEmail('supporter3@emulator.com')
    expect(supporter3.displayName).toBe('emulatedSupporter3')
    let fsSupporter3 = await admin.fs.collection('supporters').doc(supporter3.uid).get()
    expect(fsSupporter3.data().uid).toEqual(supporter3.uid)
  })
  it('Tests mockService method', async () => {
    await util.flushAuth()
    let mockData = await admin.mockService(3, false)
    expect(mockData.creator.username).toBe('emulatedCreator1')
    expect(mockData.service.serviceName).toBe('emulatedService')
    let services = await admin.fs.collection('services').get()
    expect(services.size).toBe(1)
    let svcData = services.docs[0].data()
    expect(svcData.serviceName).toBe('emulatedService')
    expect(svcData.mandatoryFill).toBe(false)
    expect(svcData.attendees).toBe(3)
  })
  it('Tests mockSession method', async () => {
    let session = await admin.mockSession('published', {
      id: '12345',
      serviceName: 'emulatedService',
      serviceDescription: 'Made by provana-tools',
      serviceCost: 23,
      serviceLength: 60,
      tags: ['cats', 'womp', 'gleep'],
      color: 'blue',
      software: 'Vim',
      attendees: 3,
      mandatoryFill: false,
      sessionDocIdArray: [],
      uid: '123abc',
      stripePrice: 'price_123',
      active: true,
    })
    expect(session.name).toBe('emulatedService')
    let ses = await admin.fs.collection('sessions').get()
    expect(ses.size).toBe(1)
    expect(ses.docs[0].data().serviceDocId).toBe('12345')
    let chatroom = await admin.fs
      .collection('chats')
      .doc(ses.docs[0].id)
      .get()
    expect(chatroom.exists).toBeTrue()
    expect(chatroom.data().creator).toBe('123abc')
    expect(chatroom.data().users[0]).toBe('123abc')
  })
  it('Tests mockSlotsForSession method', async () => {
    await util.flushDb()
    let now = dayjs().unix()
    let session = {
      sellerUid: '123abc',
      slots: 3,
      booked: 0,
      serviceDocId: '1337',
      mandatoryFill: false,
      name: 'emulatedService',
      color: 'blue',
      serviceColor: 'blue',
      start: 300 + now,
      end: 1700 + now,
      id: '12345',
      status: 'published',
    }
    await admin.fs.collection('sessions')
      .doc('12345')
      .set(session)
    const _ = await admin.mockSlotsForSession(session, [
      'published',
      'published',
      'published'
    ])
    expect(_.length).toBe(3)
    let slots = await admin.fs.collection('sessions')
      .doc('12345')
      .collection('slots')
      .get()
    expect(slots.size).toBe(3)
    slots.forEach(slot => {
      expect(slot.data().name).toBe('emulatedService')
      expect(slot.data().status).toBe('published')
    })
  })
  it('Tests publishedToFull method', async () => {
    const now = dayjs().unix()
    await util.flushDb()
    let session = {
      sellerUid: '123abc',
      slots: 3,
      booked: 3,
      serviceDocId: '1337',
      mandatoryFill: false,
      name: 'emulatedService',
      color: 'blue',
      serviceColor: 'blue',
      start: 300 + now,
      end: 1700 + now,
      id: '12345',
      status: 'published',
    }
    await admin.fs.collection('sessions')
      .doc('12345')
      .set(session)
      .catch(err => {
        console.error(err)
      })
    await admin.mockSlotsForSession('')
    await admin.publishedToFull(session.id)
    let ses = await admin.fs
      .collection('sessions')
      .doc(session.id)
      .get()
    expect(ses.data().status).toBe('full')
  })
  it('Tests mockSlotPurchase method', async () => {
    await util.flushDb()
    await util.flushAuth()
      let data = await admin.mockService(3, false)
      let session = await admin.mockSession('published', data.service)
      let slots = await admin.mockSlotsForSession(session, [
        'holding',
        'published',
        'published'
      ])
    let supporter = await admin.mockSupporter([1])
    let booked = await admin.mockSlotPurchase(slots[0], supporter[0])
    expect(booked.buyerUid).toBe(supporter[0].uid)
    let _ses = admin.fs.collection('sessions')
      .doc(slots[0].parentSession)
    let ses = await _ses.get()
    expect(ses.data().booked).toBe(1)
    let slotq = await _ses.collection('slots').where('status', '==', 'booked').get()
    expect(slotq.empty).toBeFalse()
    expect(slotq.docs[0].data().buyerUid).toBe(supporter[0].uid)
    let chat = await admin.fs.collection('chats').doc(ses.id).get()
    expect(chat.data().users).toContain(supporter[0].uid)
    let task = await admin.fs.collection('tasks').doc(slotq.docs[0].id).get()
    expect(task.exists).toBeTrue()
    expect(task.data().task).toBeTruthy()
  })
  
  it('Tests that a new Supporter can be created without loggin in', async () => {
    await util.flushAuth();
    await util.flushDb();
    const createSupporter = await admin.mockSupporter([1]);
    const newSupporter = createSupporter[0];
    const SupporterFromDb = await db.fetchSupporter(newSupporter.uid);

    expect(newSupporter.uid).toBe(SupporterFromDb.uid);
    expect(newSupporter.customer).toBe(SupporterFromDb.customer);
    expect(newSupporter.email).toBe(SupporterFromDb.email);
    expect(newSupporter.username).toBe(SupporterFromDb.username);
    expect(newSupporter.timezone).toBe(SupporterFromDb.timezone);
    expect(newSupporter.avatar).toBe(SupporterFromDb.avatar);
    expect(newSupporter.banner).toBe(SupporterFromDb.banner);
    expect(newSupporter.online).toBe(SupporterFromDb.online);
  })
})
