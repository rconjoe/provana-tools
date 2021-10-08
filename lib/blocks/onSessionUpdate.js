const inquirer = require('../inquirer')
const assertions = require('../assertions')
const util = require('../util')
const admin = require('../admin')

module.exports = {
  default: async () => {
    let chooseSessionStatusChange = await inquirer.chooseSessionStatusChange()
    switch (chooseSessionStatusChange.sessionStatusChange) {
      case 'Potential -> Published':
        let potentialToPublished_data = await admin.mockService(3, false)
        let potentialSession = await admin.mockSession('potential', potentialToPublished_data.service)
        let potentialToPublished_ready = await inquirer.ready()
        if (potentialToPublished_ready.ready === true) {
          let potentialToPublished_assert = await inquirer.assertions()
          if (potentialToPublished_assert.assertions === true) {
            await admin.potentialToPublished(potentialSession)
            console.log('\n Please wait...')
            setTimeout(async () => {
              await assertions.potentialToPublished()
            }, 5000)
          }
          else {
            console.log('\n Triggering...')
            await admin.potentialToPublished(potentialSession)
          }
        }
        return
      case 'Published -> Full':
        let publishedToFull_data = await admin.mockService(3, false)
        let publishedToFull = await admin.mockSession('published', publishedToFull_data.service)
        await admin.mockSlotsForSession(publishedToFull, [
          'booked',
          'booked',
          'booked'
        ])
        let publishedToFull_ready = await inquirer.ready()
        if (publishedToFull_ready.ready === true) {
          let publishedToFull_assert = await inquirer.assertions()
          if (publishedToFull_assert.assertions === true) {
            await admin.publishedToFull(publishedToFull.id)
            console.log('\n Please wait...')
            setTimeout(async () =>{
              await assertions.onSessionFull(publishedToFull)
            }, 5000)
          }
          else {
            console.log('\n Triggering...')
            await admin.publishedToFull(publishedToFull.id)
          }
        }
        return
      case 'Published -> Active':
        let publishedToActive_data = await admin.mockService(3, false)
        let publishedToActive_session = await admin.mockSession('published', publishedToActive_data.service)
        let publishedToActive_ready = await inquirer.ready()
        if (publishedToActive_ready.ready === true) {
          let publishedToActive_assertions = await inquirer.assertions()
          if (publishedToActive_assertions.assertions === true) {
            await admin.publishedToActive(publishedToActive_session.id)
            console.log('\n Please wait...')
            setTimeout(async () => {
              await assertions.publishedToActive(publishedToActive_session.sellerUid)
            }, 5000)
          }
          else {
            console.log('\n Ok, triggering...')
            await admin.publishedToActive(publishedToActive_session.id)
          }
        }
        return
      case 'Published -> Cancelled (empty)':
        let publishedToCancelled_data = await admin.mockService(3, false)
        let publishedToCancelled_session = await admin.mockSession('published', publishedToCancelled_data.service)
        let publishedToCancelled_supporter = await admin.mockSupporter([1])
        let publishedToCancelled_slots = await admin.mockSlotsForSession(publishedToCancelled_session, [
          'holding',
          'published',
          'published'
        ])
        await admin.mockSlotPurchase(publishedToCancelled_slots[0], publishedToCancelled_supporter[0])
        let publishedToCancelled_ready = await inquirer.ready()
        if (publishedToCancelled_ready.ready === true) {
          let publishedToActive_assertions = await inquirer.assertions()
          if (publishedToActive_assertions.assertions === true) {
            await admin.publishedToCancelled(publishedToCancelled_session)
            console.log('\n Please wait...')
            setTimeout(async () => {
              await admin.publishedToCancelled(publishedToCancelled_session)
            }, 5000)
          }
          else {
            console.log('\n Ok, triggering...')
          }
        }
        return
      case 'Published -> Cancelled (1 booked)':
      case 'Full -> Active':
        let fullToActive_data = await admin.mockService(3, false)
        let fullToActive_session = await admin.mockSession('full', fullToActive_data.service)
        let fullToActive_ready = await inquirer.ready()
        if (fullToActive_ready.ready === true) {
          let fullToActive_assertions = await inquirer.assertions()
          if (fullToActive_assertions.assertions === true) {
            await admin.fullToActive(fullToActive_session.id)
            console.log('\n Please wait...')
            setTimeout(async () => {
              await assertions.fullToActive(fullToActive_session.sellerUid)
            }, 5000)
          }
          else {
            console.log('\n Ok, triggering...')
            await admin.fullToActive(fullToActive_session.id)
          }
        }
        return
      case 'Full -> Cancelled':
        // seller cancels full session
      case 'Active -> Succeeded':
      case 'Increment booked value to fill session':
        let incrementToFull_data = await admin.mockService(3, false)
        let incrementToFull = await admin.mockSession('published', incrementToFull_data.service)
        await admin.mockSlotsForSession(incrementToFull, [
          'booked',
          'booked',
          'holding'
        ])
        let incrementToFull_ready = await inquirer.ready()
        if (incrementToFull_ready.ready === true) {
          let incrementToFull_assert = await inquirer.assertions()
          if (incrementToFull_assert.assertions === true) {
            await admin.incrementSession(incrementToFull.id)
            console.log('\n Please wait...')
            setTimeout(async () => {
              await assertions.onSessionIncrement(incrementToFull.id)
            }, 5000)
          }
          else {
            console.log('\n Triggering...')
            await admin.incrementSession(incrementToFull.id)
          }
        }
        return
    }
  }
}
