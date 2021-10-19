const inquirer = require('../inquirer')
const assertions = require('../assertions')
const util = require('../util')
const admin = require('../admin')

module.exports = {
  default: async () => {
    let chooseSlotStatusChange = await inquirer.chooseSlotStatusChange()
    switch (chooseSlotStatusChange.slotStatusChange) {
      case 'Published -> Holding':
        let publishedToHolding_data = await admin.mockService(1, false)
        let publishedToHolding_session = await admin.mockSession('published', publishedToHolding_data.service)
        let publishedToHolding_slot = await admin.mockSlotsForSession(publishedToHolding_session, ['published'])
        let publishedToHolding_ready = await inquirer.ready()
        if (publishedToHolding_ready.ready === true) {
          let publishedToHolding_assert = await inquirer.assertions()
          if (publishedToHolding_assert.assertions === true) {
            await admin.checkoutSlot(publishedToHolding_slot[0])
            console.log('\n Please wait...')
            setTimeout(async () => {
              await assertions.onSlotCheckout(publishedToHolding_slot[0])
            }, 5000)
          }
          else {
            console.log('\n Ok, triggering...')
            await admin.checkoutSlot(publishedToHolding_slot[0])
          }
        }
        return
      case 'Holding -> Booked':
        let holdingToBooked_data = await admin.mockService(1, false)
        let holdingToBooked_session = await admin.mockSession('published', holdingToBooked_data.service)
        let holdingToBooked_slots = await admin.mockSlotsForSession(holdingToBooked_session, ['holding'])
        let holdingToBooked_supporter = await admin.mockSupporter([1])
        await admin.fs.collection('sessions').doc(holdingToBooked_slots[0].parentSession)
          .collection('slots').doc(holdingToBooked_slots[0].id).update({
            buyerUid: holdingToBooked_supporter[0].uid,
            buyerUsername: holdingToBooked_supporter[0].username,
            paymentIntent: 'pi_123',
          })
        let holdingToBooked_ready = await inquirer.ready()
        if (holdingToBooked_ready.ready === true) {
          let holdingToBooked_assertions = await inquirer.assertions()
          if (holdingToBooked_assertions.assertions === true) {
            await admin.holdingToBooked(holdingToBooked_slots[0])
            console.log('\n Please wait...')
            setTimeout(async () => {
              await assertions.onSlotBooked(holdingToBooked_slots[0])
            }, 5000)
          }
          else {
            console.log('\n Ok, triggering...')
            await admin.holdingToBooked(holdingToBooked_slots[0])
          }
        }
        return
      case 'Booked -> Active':
        let bookedToActive_data = await admin.mockService(2, false)
        let bookedToActive_session = await admin.mockSession('full', bookedToActive_data.service)
        let bookedToActive_supporter = await admin.mockSupporter([1])
        let bookedToActive_slots = await admin.mockSlotsForSession(bookedToActive_session, [
          'holding',
          'published'
        ])
        await admin.mockSlotPurchase(bookedToActive_slots[0], bookedToActive_supporter[0])
        let bookedToActive_ready = await inquirer.ready()
        if (bookedToActive_ready.ready === true) {
          let bookedToActive_assert = await inquirer.assertions()
          if (bookedToActive_assert.assertions === true) {
            await admin.slotBookedToActive(bookedToActive_slots[0])
            console.log('\n Please wait...')
            setTimeout(async () =>{
              await assertions.onSlotActive(bookedToActive_supporter[0].uid, bookedToActive_slots[0].id)
            }, 5000)
            return
          }
          else {
            console.log('\n Ok, triggering...')
            await admin.slotBookedToActive(bookedToActive_slots[0])
          }
        }
        return
      case 'Booked -> Cancelled (not full)':
        let bookedToCancelled_data = await admin.mockService(3, false)
        let bookedToCancelled_session = await admin.mockSession('published', bookedToCancelled_data.service)
        let bookedToCancelled_supporter = await admin.mockSupporter([1])
        let bookedToCancelled_slots = await admin.mockSlotsForSession(bookedToCancelled_session, [
          'holding',
          'published',
          'published'
        ])
        let bookedToCancelled_booked = await admin.mockSlotPurchase(bookedToCancelled_slots[0], bookedToCancelled_supporter[0])
        let bookedToCancelled_ready = await inquirer.ready()
        if (bookedToCancelled_ready.ready === true) {
          let bookedToCancelled_assertions = await inquirer.assertions()
          if (bookedToCancelled_assertions.assertions === true) {
            await admin.bookedToCancelled(bookedToCancelled_booked)
            console.log('\n Please wait...')
            setTimeout(async () => {
              await assertions.bookedToCancelled(bookedToCancelled_booked)
            }, 5000)
          }
          else {
            console.log('\n Ok, triggering...')
            await admin.bookedToCancelled(bookedToCancelled_booked)
          }
        }
        return
      case 'Booked -> Cancelled (full)':
        let bookedToCancelled_full_data = await admin.mockService(3, false)
        let bookedToCancelled_full_session = await admin.mockSession('published', bookedToCancelled_full_data.service)
        let bookedToCancelled_full_supporter = await admin.mockSupporter([1, 2, 3])
        let bookedToCancelled_full_slots = await admin.mockSlotsForSession(bookedToCancelled_full_session, [
          'holding',
          'holding',
          'holding'
        ])
        let bookedToCancelled_full_booked_1 = await admin.mockSlotPurchase(bookedToCancelled_full_slots[0], bookedToCancelled_full_supporter[0])
        await admin.mockSlotPurchase(bookedToCancelled_full_slots[1], bookedToCancelled_full_supporter[1])
        await admin.mockSlotPurchase(bookedToCancelled_full_slots[2], bookedToCancelled_full_supporter[2])
        let bookedToCancelled_full_ready = await inquirer.ready()
        if (bookedToCancelled_full_ready.ready === true) {
          let bookedToCancelled_full_assertions = await inquirer.assertions()
          if (bookedToCancelled_full_assertions.assertions === true) {
            await admin.bookedToCancelled(bookedToCancelled_full_booked_1)
            console.log('\n Please wait...')
            setTimeout(async () => {
              await assertions.bookedToCancelled_full(bookedToCancelled_full_booked_1)
            }, 5000)
          }
          else {
            console.log('\n Ok, triggering...')
            await admin.bookedToCancelled(bookedToCancelled_full_booked_1)
          }
        }
        return
      case 'Active -> Disputed':
      case 'Disputed -> Resolved+':
      case 'Disputed -> Resolved-':
    }
  }
}
