require('jest')
require('jest-extended')
const admin = require('../lib/admin')
const util = require('../lib/util')
const clientauth = require('../lib/auth')
const dayjs = require('dayjs')

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
    await admin.mockCreator()
    let m = await clientauth.auth.fetchSignInMethodsForEmail('creator@emulator.com')
    expect(m.length).toEqual(1)
    let creator = await admin.auth.getUserByEmail('creator@emulator.com')
    expect(creator.displayName).toBe('emulatedCreator')
    let fsCreator = await admin.fs.collection('creators').doc(creator.uid).get()
    expect(fsCreator.data().uid).toEqual(creator.uid)
  })
  it('Tests mockSupporter method', async () => {
    await admin.mockSupporter()
    let m = await clientauth.auth.fetchSignInMethodsForEmail('supporter@emulator.com')
    expect(m.length).toEqual(1)
    let supporter = await admin.auth.getUserByEmail('supporter@emulator.com')
    expect(supporter.displayName).toBe('emulatedSupporter')
    let fsSupporter = await admin.fs.collection('supporters').doc(supporter.uid).get()
    expect(fsSupporter.data().uid).toEqual(supporter.uid)
  })
  it('Tests mockService method', async () => {
    let mockData = await admin.mockService(3, false)
    expect(mockData.creator.username).toBe('emulatedCreator')
    expect(mockData.service.serviceName).toBe('emulatedService')
    let services = await admin.fs.collection('services').get()
    expect(services.size).toBe(1)
    let svcData = services.docs[0].data()
    expect(svcData.serviceName).toBe('emulatedService')
    expect(svcData.mandatoryFill).toBe(false)
    expect(svcData.attendees).toBe(3)
  })
  it('Tests mockSession method', async () => {
    let session = await admin.mockSession('potential', {
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
    await admin.mockSlotsForSession(session, [
      'published',
      'booked',
      'full'
    ])
    let slots = await admin.fs.collection('sessions')
      .doc('12345')
      .collection('slots')
      .get()
    expect(slots.size).toBe(3)
    slots.forEach(slot => {
      expect(slot.data().name).toBe('emulatedService')
      expect(slot.data().status).toBeOneOf(['published', 'booked', 'full'])
    })
    let ses = await admin.fs.collection('sessions')
      .doc('12345')
      .get()
    expect(ses.data().booked).toBe(1)
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
    await admin.publishedToFull(session.id)
    let ses = await admin.fs
      .collection('sessions')
      .doc(session.id)
      .get()
    expect(ses.data().status).toBe('full')
  })
})
