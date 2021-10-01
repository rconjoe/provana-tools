#!/usr/bin/env node
const chalk = require('chalk')
const figlet = require('figlet')
const inquirer = require('../lib/inquirer')
const Auth = require('../lib/auth')
const db = require('../lib/db')
const assertions = require('../lib/assertions')
const util = require('../lib/util')
const admin = require('../lib/admin')


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
        if (slot_mf === true) {
          // mandatory fill sessions...
        }
        else {
          let chooseSlotStatusChange = await inquirer.chooseSessionStatusChange()
          switch (chooseSlotStatusChange.sessionStatusChange) {
            // case slot status changes...
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
      case 'capture':
      case 'writeNewReview':
      case 'getRecentReviews':
      case 'getReviewScore':
    }
  }
  else console.log(`\n (× _ ×# \n You broke it D: \n`)
}

run()
