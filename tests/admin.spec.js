require('jest')
const admin = require('../lib/admin')
const util = require('../lib/util')
const clientauth = require('../lib/auth')

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
})
