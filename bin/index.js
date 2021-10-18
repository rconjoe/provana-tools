#!/usr/bin/env node
const chalk = require('chalk')
const figlet = require('figlet')
const inquirer = require('../lib/inquirer')
const Auth = require('../lib/auth')
const db = require('../lib/db')
const assertions = require('../lib/assertions')
const util = require('../lib/util')
const admin = require('../lib/admin')
const onSessionUpdate = require('../lib/blocks/onSessionUpdate')
const onSlotUpdate = require('../lib/blocks/onSlotUpdate')
const registerSupporter = require('../lib/blocks/registerSupporter')
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
      console.log('proceeding as a non loged in user... \n');
      let action = await inquirer.chooseAnonAction()
      switch (action.action) {
        case 'Register New Supporter':
        // await util.flushAuth();
        // await util.flushDb();
        await registerSupporter.anon()
        break
      }
      return
    }
  }

  else if (category.category === 'Functions Testing (Admin SDK)') {
    let functions = await inquirer.chooseFunction()
    switch (functions.functions) {
      case 'onSessionUpdate/':
        await util.flushDb()
        await util.flushAuth()
        let session_mf = await inquirer.chooseMF()
        if (session_mf.mf === true) {
          await onSessionUpdate_mf.default()
        }
        else if (session_mf.mf === false) {
          await onSessionUpdate.default()
          return
        }
      case 'onSlotUpdate/':
        await util.flushDb()
        await util.flushAuth()
        let slot_mf = await inquirer.chooseMF()
        if (slot_mf.mf === true) {
          await onSlotUpdate_mf.default()
          return
        }
        else {
          await onSlotUpdate.default()
          return
        }
        
      case 'registerSupporter':
        await util.flushDb();
        await util.flushAuth()
        await registerSupporter.default()
        return

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
