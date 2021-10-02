#!/usr/bin/env node
const chalk = require('chalk')
const figlet = require('figlet')
const inquirer = require('../lib/inquirer')
const Auth = require('../lib/auth')
const db = require('../lib/db')
const assertions = require('../lib/assertions')
const util = require('../lib/util')
const admin = require('../lib/admin')
const nock = require('../lib/nock')


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
            case 'Published -> Cancelled':
            case 'Full -> Active':
            case 'Full -> Cancelled':
            case 'Active -> Succeeded':
            case 'Increment booked value to fill session':
              await util.flushDb()
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
              else return
            case 'Holding -> Booked':
              await util.flushDb()
              let holdingToBooked_data = await admin.mockService(1, false)
              let holdingToBooked_session = await admin.mockSession('published', holdingToBooked_data.service)
              let holdingToBooked_slots = await admin.mockSlotsForSession(holdingToBooked_session, ['holding'])
              let holdingToBooked_supporter = await admin.mockSupporter()
              await admin.fs.collection('sessions').doc(holdingToBooked_slots[0].parentSession)
                .collection('slots').doc(holdingToBooked_slots[0].id).update({
                  buyerUid: holdingToBooked_supporter.uid,
                  buyerUsername: holdingToBooked_supporter.username,
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
            case 'Booked -> Active':
              await util.flushDb()
              let bookedToActive_data = await admin.mockService(2, false)
              let bookedToActive_session = await admin.mockSession('full', bookedToActive_data.service)
              let bookedToActive_supporter = await admin.mockSupporter()
              let bookedToActive_slots = await admin.mockSlotsForSession(bookedToActive_session, [
                'holding',
                'published'
              ])
              await admin.fs.collection('sessions').doc(bookedToActive_session.id)
                .collection('slots').doc(bookedToActive_slots[0].id).update({
                  buyerUid: bookedToActive_supporter.uid,
                  buyerUsername: bookedToActive_supporter.username,
                  paymentIntent: 'pi_123',
                })
              let bookedToActive_ready = await inquirer.ready()
              if (bookedToActive_ready.ready === true) {
                let bookedToActive_assert = await inquirer.assertions()
                if (bookedToActive_assert.assertions === true) {
                  await admin.slotBookedToActive(bookedToActive_slots[0])
                  console.log('\n Please wait...')
                  setTimeout(async () =>{
                    await assertions.onSlotActive(bookedToActive_supporter.uid)
                  }, 5000)
                }
                else {
                  console.log('\n Ok, triggering...')
                  await admin.slotBookedToActive(bookedToActive.slots[0])
                }
              }

            case 'Booked -> Cancelled':
            case 'Cancelled -> Published':
            case 'Active -> Disputed':
            case 'Disputed -> Resolved+':
            case 'Disputed -> Resolved-':
          }
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
