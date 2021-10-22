const firebase = require('./firebase')
const faker = require('faker')
const admin = require('./admin')
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
    const registerSupporter = functions.httpsCallable('registerSupporter')
    await registerSupporter({
      email: 'supporter@emulator.com',
      password: 'supporter',
      username: 'emulatedSupporter'
    })
      .catch(err => {
        console.error(err)
      })
  },

  createService: async (email, slots, mf, uid) => {
    const _createService = functions.httpsCallable('createService')
    const service = {
      serviceName: faker.commerce.productName(),
      serviceDescription: faker.commerce.productDescription(),
      serviceCost: 23,
      serviceLength: 60,
      tags: ['tag1', 'tag2', 'tag3'],
      color: 'blue',
      software: 'software',
      attendees: slots,
      mandatoryFill: mf,
      uid: uid
    }
    await _createService(service)
    return service
  },

  publishPotential: async (sellerUid) => {
    const publish = functions.httpsCallable('publishPotential')
    await publish({uid: sellerUid})
      .catch(err => console.error(err))
  }
}
