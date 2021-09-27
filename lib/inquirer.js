const inquirer = require('inquirer')

module.exports = {
  chooseCategory: () => {
    const categoryPrompt = [{
      name: 'category',
      message: '\n ᕕ(⌐■_■)ᕗ ♪♬ \n What can I help you with?',
      type: 'list',
      choices: [
        'Simulate User Input'
      ]
    }]
    return inquirer.prompt(categoryPrompt)
  },

  chooseAuth: () => {
    const authPrompt = [{
      name: 'auth',
      message: 'Who should I log in as?',
      type: 'list',
      choices: [
        'Creator',
        'Supporter',
        'Anonymous'
      ]
    }]
    return inquirer.prompt(authPrompt)
  },

  chooseCreatorAction: () => {
    const actionPrompt = [{
      name: 'action',
      message: 'Choose an action to simulate. \n *** Note: You must have the emulators running with the proper import for whichever option you choose. *** \n (see .exports/ folder in functions repo)',
      type: 'list',
      choices: [
        'Create potential session',
        'Publish session: requires .publishSession/',
      ]
    }]
    return inquirer.prompt(actionPrompt)
  },

  chooseSupporterAction: () => {
    const actionPrompt = [{
      name: 'action',
      message: 'Choose an action to simulate. \n *** Note: You must have the emulators running with the proper import for whichever option you choose. *** \n (see .exports/ folder in functions repo)',
      type: 'list',
      choices: [
        'Checkout slot: requires .checkoutSlots'
      ]
    }]
    return inquirer.prompt(actionPrompt)
  },

}
