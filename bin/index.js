#!/usr/bin/env node
const chalk = require('chalk')
const figlet = require('figlet')
const inquirer = require('../lib/inquirer')
const Auth = require('../lib/auth')
const db = require('../lib/db')
const assertions = require('../lib/assertions')
const util = require('../lib/util')
const admin = require('../lib/admin')
// const nock = require('../lib/nock')


const run = async () => {

  // logo
  console.log(
    chalk.cyan((figlet.textSync(
      'provana-tools',
      { horizontalLayout: 'full' }
    )))
  )

  let category = await inquirer.chooseCategory()
  if (category.category === 'Simulate User Input (Client SDK)') {

    let auth = await inquirer.chooseAuth()
    if (auth.auth === 'Creator') {
      const user = await Auth.signInCreator()
      console.log(`\n Logged in as ${user.email}! \n`)

      let action = await inquirer.chooseCreatorAction()
      switch (action) {
        case 'Create potential session':
          await db.writePotential(user.uid)
          console.log('Complete.')
          return
        case 'Publish session: requires .publishSession/':
          await db.publishSession()
          console.log('Complete.')
          return
        default: return
      }
    }

    else if (auth.auth === 'Supporter') {
      const user = await Auth.signInSupporter()
      console.log(`\n Logged in as ${user.email}! \n`)

      let action = await inquirer.chooseSupporterAction()
      switch (action) {
        case 'Checkout slot: requires .checkoutSlots/':
          console.log('bingo')
          break
        default: return
      }
      return
    }

    else if (auth.auth === 'Anonymous') {
      console.log('Nothing yet...')
    }
  }

  else if (category.category === 'Functions Testing (Admin SDK)') {
    let functions = await inquirer.chooseFunction()
    switch (functions.functions) {
      case 'onSessionUpdate/':
        await util.flushDb()
        await util.flushAuth()
        let session_mf = await inquirer.chooseMF()
        if (session_mf === true) {
          // mandatory fill sessions...
        }
        else {
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
              await util.flushDb()
              await util.flushAuth()
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
              await util.flushDb()
              await util.flushAuth()
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
            case 'Published -> Cancelled':
            case 'Full -> Active':
              await util.flushDb()
              await util.flushAuth()
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
              await util.flushDb()
              await util.flushAuth()
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
      case 'onSlotUpdate/':
        let slot_mf = await inquirer.chooseMF()
        if (slot_mf.mf === true) {
          // mandatory fill sessions...
        }
        else {
          let chooseSlotStatusChange = await inquirer.chooseSlotStatusChange()
          switch (chooseSlotStatusChange.slotStatusChange) {
            case 'Published -> Holding':
              await util.flushDb()
              await util.flushAuth()
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
              await util.flushDb()
              await util.flushAuth()
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
              await util.flushDb()
              await util.flushAuth()
              let bookedToActive_data = await admin.mockService(2, false)
              let bookedToActive_session = await admin.mockSession('full', bookedToActive_data.service)
              let bookedToActive_supporter = await admin.mockSupporter([1])
              let bookedToActive_slots = await admin.mockSlotsForSession(bookedToActive_session, [
                'holding',
                'published'
              ])
              await admin.fs.collection('sessions').doc(bookedToActive_session.id)
                .collection('slots').doc(bookedToActive_slots[0].id).update({
                  buyerUid: bookedToActive_supporter[0].uid,
                  buyerUsername: bookedToActive_supporter[0].username,
                  paymentIntent: 'pi_123',
                })
              let bookedToActive_ready = await inquirer.ready()
              if (bookedToActive_ready.ready === true) {
                let bookedToActive_assert = await inquirer.assertions()
                if (bookedToActive_assert.assertions === true) {
                  await admin.slotBookedToActive(bookedToActive_slots[0])
                  console.log('\n Please wait...')
                  setTimeout(async () =>{
                    await assertions.onSlotActive(bookedToActive_supporter[0].uid)
                  }, 5000)
                }
                else {
                  console.log('\n Ok, triggering...')
                  await admin.slotBookedToActive(bookedToActive.slots[0])
                }
              }
              return
            case 'Booked -> Cancelled (not full)':
              await util.flushDb()
              await util.flushAuth()
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
              await util.flushDb()
              await util.flushAuth()
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
            case 'Cancelled -> Published':
            case 'Active -> Disputed':
            case 'Disputed -> Resolved+':
            case 'Disputed -> Resolved-':
          }
          return
        }
      case 'registerSupporter':
      case 'getOrCreateInvitation':
      case 'validateInvitation':
      case 'registerCreator':
      case 'stripeAccountOnboard':
      case 'stripeCompleteOnboard':
      case 'createService':
      case 'publishPotential':
      case 'checkout':
      case 'confirmCheckoutComplete':
      case 'checkoutComplete':
      case 'startSlot':
              // await util.flushDb()
              // await util.flushAuth()
              // let publishedToActive_data = await admin.mockService(3, false)
              // let publishedToActive_session = await admin.mockSession('published', publishedToActive_data.service)
              // let publishedToActive_slots = await admin.mockSlotsForSession(publishedToActive_session, [
              //   'published',
              //   'booked',
              //   'booked'
              // ])
              // nock.PaymentIntent_requires_capture()
      case 'capture':
      case 'writeNewReview':
      case 'getRecentReviews':
      case 'getReviewScore':
    }
  }
  else console.log(`\n (× _ ×# \n You broke it D: \n`)
}

run()
