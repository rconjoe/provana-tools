#!/usr/bin/env node
const chalk = require('chalk')
const figlet = require('figlet')
const inquirer = require('../lib/inquirer')
const db = require('../lib/db')

const delay = ms => new Promise(res => setTimeout(res, ms));

const run = async () => {
  console.log(
    chalk.ansi256(13)(figlet.textSync(
      'provana-tools',
      { horizontalLayout: 'full' }
    ))
  )
  await delay(2000)
  let category = await inquirer.chooseCategory()
  if (category.category === 'Simulate User Input') {
    let lifecycle = await inquirer.chooseLifecycle()
    if (lifecycle.lifecycle === 'Session/Slot states') {
      let state = await inquirer.chooseState()
      switch (state.state) {
        case 'Session: potential -> published':
          await db.publishSession()
        case 'Slot: published -> holding, non-MF':
          await db.checkoutSlot()
        default: return
      }
    }
  }
  else console.log(`\n (× _ ×# \n You broke it D: \n`)
}

run()
