#!/usr/bin/env node
const chalk = require('chalk')
const figlet = require('figlet')
const inquirer = require('../lib/inquirer')
const Auth = require('../lib/auth')
const db = require('../lib/db')
// const functions = require('../lib/functions')
const admin = require('../lib/admin')


const run = async () => {

  // logo
  console.log(
    chalk.ansi256(13)(figlet.textSync(
      'provana-tools',
      { horizontalLayout: 'full' }
    ))
  )

  // make test users
  // TODO: handle if they're already created so you don't need to restart emus
  await admin.mockCreator()
  await admin.mockSupporter()

  let category = await inquirer.chooseCategory()
  if (category.category === 'Simulate User Input') {

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

  else if (category.category === 'Test API functions') {
    console.log('hi')
  }
  else console.log(`\n (× _ ×# \n You broke it D: \n`)
}

run()
